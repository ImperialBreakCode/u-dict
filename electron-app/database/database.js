const fs = require('fs');
const sqlite = require('sqlite3');

const db = new sqlite.Database('database.sqlite', (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log('connected to database');
    }
});