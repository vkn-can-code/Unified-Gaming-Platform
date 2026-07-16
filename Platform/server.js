const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

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

app.use(cors());
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

// Serve individual games dynamically
app.use('/play/:gameName', (req, res, next) => {
    const gameName = req.params.gameName;
    
    // Security: Prevent Path Traversal
    if (gameName.includes('..') || gameName.includes('/') || gameName.includes('\\')) {
        return res.status(400).send('Invalid game name');
    }

    const gameDistPath = path.join(gamesDir, gameName, 'dist');
    const gameRootPath = path.join(gamesDir, gameName);

    // Prefer dist directory, otherwise try root if no build step
    if (fs.existsSync(gameDistPath)) {
        express.static(gameDistPath)(req, res, next);
    } else if (fs.existsSync(gameRootPath)) {
        express.static(gameRootPath)(req, res, next);
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
        res.sendFile(indexFile);
    } else {
        res.status(404).send('Game index not found');
    }
});


app.listen(PORT, () => {
    console.log(`Unified Game Platform running on http://localhost:${PORT}`);
});
