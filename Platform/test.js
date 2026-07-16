const http = require('http');

const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/assets/index-Dgtw87rB.js', // This might not be the exact filename now if they rebuilt it, but let's test a generic asset or index.html
    method: 'GET',
    headers: {
        'Referer': 'http://localhost:3000/play/TicTacToe'
    }
}, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers, null, 2)}`);
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk.toString().substring(0, 50)}...`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
