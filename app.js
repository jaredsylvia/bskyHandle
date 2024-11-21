const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3783;

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS didCache (subdomain TEXT PRIMARY KEY, did TEXT, timestamp INTEGER)');
});

app.get('/.well-known/atproto-did', (req, res) => {
    const subdomain = req.hostname.split('.')[0];

    db.get('SELECT did FROM didCache WHERE subdomain = ?', [subdomain], (err, row) => {
        if (row) {
            res.send(row.did);
        } else {
            res.send('No DID set');
        }
    });
});

app.get('/set/:did', (req, res) => {
    const subdomain = req.hostname.split('.')[0];
    const did = req.params.did;

    db.run('INSERT OR REPLACE INTO didCache (subdomain, did, timestamp) VALUES (?, ?, ?)', [subdomain, did, Date.now()], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(`DID set to ${did}`);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
