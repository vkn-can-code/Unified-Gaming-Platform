const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const queue = require('./queue');
const crypto = require('crypto');

// Initialize Database
queue.initDB();

const app = express();
const PORT = process.env.PORT || 677;

// Security: Basic HTTP header protections (CSP disabled to allow diverse games)
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: "no-referrer-when-downgrade" }
}));

// Security: DDoS & Brute Force Protection (Rate Limiting)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per window to allow game assets to load
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// Middleware to fix absolute paths used by games (like Vite's /assets/...)
app.use((req, res, next) => {
    // Skip API, explicitly play routes, and root
    if (!req.path.startsWith('/play/') && !req.path.startsWith('/api/') && req.path !== '/') {
        const referer = req.get('Referer');
        if (referer) {
            try {
                const refererUrl = new URL(referer);
                const match = refererUrl.pathname.match(/^\/play\/([^\/]+)/);
                if (match) {
                    const gameName = match[1];
                    
                    // Security: Prevent Path Traversal
                    if (gameName.includes('..') || gameName.includes('/') || gameName.includes('\\') || req.path.includes('..')) {
                        return next();
                    }

                    const gameDistPath = path.join(gamesDir, gameName, 'dist');
                    const filePath = path.join(gameDistPath, req.path);
                    
                    if (fs.existsSync(filePath)) {
                        return res.sendFile(filePath);
                    }
                }
            } catch (e) {
                // Ignore invalid URLs
            }
        }
    }
    next();
});

const allowedOrigins = [
    'http://localhost:3000', 
    'http://localhost:677',
    'http://localhost:677'
];
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'portal', 'dist')));

// Path to the games directory
const gamesDir = path.join(__dirname, '..', 'Games');

// Get available games
app.get('/api/games', (req, res) => {
    try {
        if (!fs.existsSync(gamesDir)) {
            return res.json({ games: [] });
        }
        
        const games = [];
        const folders = fs.readdirSync(gamesDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        for (const folder of folders) {
            const gamePath = path.join(gamesDir, folder);
            
            // For now, we assume the game has a `dist` folder.
            // If it doesn't, we can add a fallback later.
            let hasDist = fs.existsSync(path.join(gamePath, 'dist'));
            
            games.push({
                id: folder.toLowerCase().replace(/\s+/g, '-'),
                name: folder,
                hasDist: hasDist,
                playUrl: `/play/${folder}`
            });
        }
        
        res.json({ games });
    } catch (error) {
        console.error('Error reading games directory:', error);
        res.status(500).json({ error: 'Failed to load games' });
    }
});

// Queue Endpoints
app.post('/api/queue/join', async (req, res) => {
    const { game } = req.body;
    let token = req.cookies.play_token;
    if (!token) {
        token = crypto.randomUUID();
        res.cookie('play_token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    }
    try {
        const status = await queue.joinQueue(token, game);
        res.json({ status, token });
    } catch (e) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/api/queue/status', async (req, res) => {
    const token = req.cookies.play_token;
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
        await queue.heartbeat(token);
        const result = await queue.getStatus(token);
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/queue/heartbeat', async (req, res) => {
    const token = req.cookies.play_token;
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
        await queue.heartbeat(token);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/queue/leave', async (req, res) => {
    const token = req.cookies.play_token;
    if (token) {
        try {
            await queue.leave(token);
            res.clearCookie('play_token');
        } catch (e) {}
    }
    res.json({ success: true });
});

// Protect /play routes
app.use('/play/:gameName', async (req, res, next) => {
    const token = req.cookies.play_token;
    if (!token) {
        return res.redirect('/');
    }
    try {
        const status = await queue.getStatus(token);
        if (status.status !== 'playing') {
            return res.redirect('/'); // Not allowed to play yet
        }
        next();
    } catch (e) {
        res.redirect('/');
    }
});

// Serve individual games dynamically
app.use('/play/:gameName', (req, res, next) => {
    const gameName = req.params.gameName;
    
    // Security: Prevent Path Traversal
    if (gameName.includes('..') || gameName.includes('/') || gameName.includes('\\')) {
        return res.status(400).send('Invalid game name');
    }

    const gameDistPath = path.join(gamesDir, gameName, 'dist');
    const gameRootPath = path.join(gamesDir, gameName);
    
    // If asking for root, inject heartbeat script
    if (req.path === '/' || req.path === '') {
        let indexFile = '';
        if (fs.existsSync(gameDistPath)) indexFile = path.join(gameDistPath, 'index.html');
        else if (fs.existsSync(gameRootPath)) indexFile = path.join(gameRootPath, 'index.html');

        if (fs.existsSync(indexFile)) {
            let html = fs.readFileSync(indexFile, 'utf8');
            const script = `
            <script>
                setInterval(() => {
                    fetch('/api/queue/heartbeat', { method: 'POST' }).catch(e=>console.error(e));
                }, 10000);
                window.addEventListener('beforeunload', () => {
                    navigator.sendBeacon('/api/queue/leave');
                });
            </script>
            `;
            // Inject before </head> or </body>
            if (html.includes('</head>')) {
                html = html.replace('</head>', script + '</head>');
            } else {
                html += script;
            }
            return res.send(html);
        }
    }

    // Otherwise serve static files normally
    if (fs.existsSync(gameDistPath)) {
        express.static(gameDistPath, { index: false })(req, res, next);
    } else if (fs.existsSync(gameRootPath)) {
        express.static(gameRootPath, { index: false })(req, res, next);
    } else {
        res.status(404).send('Game not found');
    }
});

// For HTML5 games served via Express static, we might need a catch-all for SPA client-side routing within the game
app.use('/play/:gameName', (req, res) => {
    const gameName = req.params.gameName;
    
    // Security: Prevent Path Traversal
    if (gameName.includes('..') || gameName.includes('/') || gameName.includes('\\')) {
        return res.status(400).send('Invalid game name');
    }

    const gameDistPath = path.join(gamesDir, gameName, 'dist');
    const gameRootPath = path.join(gamesDir, gameName);
    
    let indexFile = '';
    if (fs.existsSync(gameDistPath)) {
        indexFile = path.join(gameDistPath, 'index.html');
    } else if (fs.existsSync(gameRootPath)) {
        indexFile = path.join(gameRootPath, 'index.html');
    }

    if (fs.existsSync(indexFile)) {
        let html = fs.readFileSync(indexFile, 'utf8');
        const script = `
        <script>
            setInterval(() => {
                fetch('/api/queue/heartbeat', { method: 'POST' }).catch(e=>console.error(e));
            }, 10000);
            window.addEventListener('beforeunload', () => {
                navigator.sendBeacon('/api/queue/leave');
            });
        </script>
        `;
        if (html.includes('</head>')) {
            html = html.replace('</head>', script + '</head>');
        } else {
            html += script;
        }
        res.send(html);
    } else {
        res.status(404).send('Game index not found');
    }
});


// Fallback for React Router in Portal
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'portal', 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Arcane Realm Platform running at http://localhost:${PORT}`);
});
