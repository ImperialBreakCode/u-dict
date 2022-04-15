const fs = require('fs');
const sqlite = require('sqlite3');
const { open } = require('sqlite');

class AppDatabse{
    constructor(databaseDir){
        this.db = null;
        this.createTables.bind(this);
        this.databaseDir = databaseDir;
    }

    createTables = (filename) => {

        createDbConnection(this.databaseDir).then(databse => {

            this.db = databse;

            let sql = fs.readFileSync(filename).toString();
            this.db.exec(sql, (result, err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(result);
                }
            })
        });
        
    
    };
}

function createDbConnection(filename) {
    return open({
        filename,
        driver: sqlite.Database
    });
}

module.exports = { AppDatabse }
