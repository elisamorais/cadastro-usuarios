const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');

let db = null;

let connect = async function () {
    try {

        db = await sqlite.open({ filename: 'src/db/database.db', driver: sqlite3.Database });
        console.log('Conectado ao banco de dados.');

        await db.run("CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, nome TEXT, email TEXT, idade INT)");
        console.log('Tabela user criada.');

    } catch (error) {
        console.log(error)
    }

    return db;
}

let insertUser = async function(user) {
    try {
        await connect();

        let result = await db.run('INSERT INTO user (nome, email, idade) VALUES ("'+ user.nome +'", "'+ user.email +'", '+ user.idade +')');
        console.log(result);

        await db.close();

    } catch (error) {
        console.log(error)
    }
}

let listUsers = async function(page) {
    let result = []
    try {
        let pageSize = 5;
        let offset = page * pageSize

        await connect();
        const rows = await db.all('SELECT * FROM user LIMIT '+ pageSize +' OFFSET '+ offset);

        for (let i = 0; i < rows.length; i++) {
            result.push(rows[i]);
        }
    } catch (error) {
        console.log(error)
    }

    return result;
}

module.exports = {
    connect,
    insertUser,
    listUsers
}

