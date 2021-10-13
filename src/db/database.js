const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');

let db = null;

let connect = async function () {
    try {
        if (isTestMode()) {
            db = await sqlite.open({ filename: 'src/db/database-test.db', driver: sqlite3.Database });
        } else {
            db = await sqlite.open({ filename: 'src/db/database.db', driver: sqlite3.Database });
        }

        await db.run("CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, nome TEXT, email TEXT, idade INT)");
    } catch (error) {
        console.log(error)
    }

    return db;
}

let insertUser = async function(user) {
    let result;

    try {
        await connect();

        result = await db.run('INSERT INTO user (nome, email, idade) VALUES ("'+ user.nome +'", "'+ user.email +'", '+ user.idade +')');

        await db.close();

    } catch (error) {
        console.log(error)
    }
    return result;
}

let deleteUser = async function(nome) {
    let result = null;
    try {
        await connect();
        result = await db.run('DELETE FROM user WHERE nome = "'+ nome + '"');
        await db.close();

    } catch (error) {
        console.log(error)
    }

    return result;
}

let getUser = async function(nome) {
    let result = null;
    try {
        await connect();
        result = await db.get('SELECT * FROM user WHERE nome = "'+ nome + '"');
        await db.close();

    } catch (error) {
        console.log(error)
    }

    return result;
}


let updateUser = async function(nome, dados) {
    let result = null;
    
    try {
        await connect();
        result = await db.run(`
            UPDATE user 
            SET
                nome = "${dados.nome}",
                email = "${dados.email}",
                idade = ${dados.idade}
            WHERE
                nome = "${nome}"
        `);
        await db.close();

    } catch (error) {
        console.log(error)
    }

    return result;
}

let listUsers = async function(page) {
    let rowsDb;
    let totalDb;
    try {
        let pageSize = 5;
        let offset = page * pageSize;

        await connect();
        rowsDb = await db.all('SELECT * FROM user LIMIT '+ pageSize +' OFFSET '+ offset);
        totalDb = await db.get('SELECT COUNT(id) as total FROM user');
    } catch (error) {
        console.log(error)
    }

    return {
        total: totalDb.total,
        rows: rowsDb
    };
}

// https://stackoverflow.com/questions/29183044/how-to-detect-if-a-mocha-test-is-running-in-node-js
let isTestMode = function() {
    return typeof global.it === 'function';
}

module.exports = {
    connect,
    insertUser,
    listUsers,
    deleteUser,
    getUser,
    updateUser
}

