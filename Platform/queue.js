const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'queue.db');
const db = new sqlite3.Database(dbPath);

const MAX_PLAYERS = 5;
const HEARTBEAT_TIMEOUT = 15000; // 15 seconds
const QUEUE_TIMEOUT = 60000; // 60 seconds (if someone in queue drops connection)

function initDB() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS sessions (
                token TEXT PRIMARY KEY,
                game TEXT,
                status TEXT,
                lastHeartbeat INTEGER,
                createdAt INTEGER
            )
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS platform_stats (
                id INTEGER PRIMARY KEY,
                total_matches INTEGER
            )
        `);
        db.run(`INSERT OR IGNORE INTO platform_stats (id, total_matches) VALUES (1, 89530)`);
    });
}

function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

function getQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function allQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

async function joinQueue(token, game) {
    const now = Date.now();
    
    // Check if token already exists
    const existing = await getQuery(`SELECT status FROM sessions WHERE token = ?`, [token]);
    if (existing) {
        return existing.status;
    }

    const { count } = await getQuery(`SELECT COUNT(*) as count FROM sessions WHERE status = 'playing'`);
    const status = count < MAX_PLAYERS ? 'playing' : 'queued';

    await runQuery(
        `INSERT INTO sessions (token, game, status, lastHeartbeat, createdAt) VALUES (?, ?, ?, ?, ?)`,
        [token, game, status, now, now]
    );

    if (status === 'playing') {
        await runQuery(`UPDATE platform_stats SET total_matches = total_matches + 1 WHERE id = 1`);
    }

    return status;
}

async function getStatus(token) {
    const session = await getQuery(`SELECT status, createdAt FROM sessions WHERE token = ?`, [token]);
    if (!session) return { error: 'Invalid token' };

    if (session.status === 'playing') {
        return { status: 'playing', position: 0 };
    }

    const { count } = await getQuery(
        `SELECT COUNT(*) as count FROM sessions WHERE status = 'queued' AND createdAt <= ?`, 
        [session.createdAt]
    );

    return { status: 'queued', position: count };
}

async function heartbeat(token) {
    const res = await runQuery(`UPDATE sessions SET lastHeartbeat = ? WHERE token = ?`, [Date.now(), token]);
    return res.changes > 0;
}

async function leave(token) {
    await runQuery(`DELETE FROM sessions WHERE token = ?`, [token]);
    await processQueue();
}

async function processQueue() {
    const now = Date.now();
    
    // Evict dead playing sessions
    await runQuery(`DELETE FROM sessions WHERE status = 'playing' AND lastHeartbeat < ?`, [now - HEARTBEAT_TIMEOUT]);
    
    // Evict dead queued sessions (if they stopped polling)
    await runQuery(`DELETE FROM sessions WHERE status = 'queued' AND lastHeartbeat < ?`, [now - QUEUE_TIMEOUT]);

    // Check how many slots are open
    const { count } = await getQuery(`SELECT COUNT(*) as count FROM sessions WHERE status = 'playing'`);
    const availableSlots = MAX_PLAYERS - count;

    if (availableSlots > 0) {
        // Promote the next X users in queue
        const nextUsers = await allQuery(
            `SELECT token FROM sessions WHERE status = 'queued' ORDER BY createdAt ASC LIMIT ?`,
            [availableSlots]
        );

        for (const user of nextUsers) {
            await runQuery(`UPDATE sessions SET status = 'playing', lastHeartbeat = ? WHERE token = ?`, [now, user.token]);
        }
        
        if (nextUsers.length > 0) {
            await runQuery(`UPDATE platform_stats SET total_matches = total_matches + ? WHERE id = 1`, [nextUsers.length]);
        }
    }
}

async function getPlatformStats() {
    const { count } = await getQuery(`SELECT COUNT(*) as count FROM sessions`);
    const stats = await getQuery(`SELECT total_matches FROM platform_stats WHERE id = 1`);
    return {
        activePlayers: count,
        totalMatches: stats ? stats.total_matches : 89530
    };
}

// Run cleanup loop every 5 seconds
setInterval(() => {
    processQueue().catch(err => console.error('Queue processing error:', err));
}, 5000);

module.exports = {
    initDB,
    joinQueue,
    getStatus,
    heartbeat,
    leave,
    processQueue,
    getPlatformStats
};
