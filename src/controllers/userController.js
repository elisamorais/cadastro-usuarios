const Router = require('koa-router');
const router = new Router();
const db = require('../db/database')

// Insere (Adiciona) um novo user
router.post('/user', async (ctx, next) => {

    let user = ctx.request.body;

    let resultStatus;
    if (parseInt(user.idade) >= 18) {
        let result = await db.insertUser(user);
        if (result.changes > 0) {
            ctx.body = { 
                success: true,
                message: 'Usuário cadastrado com sucesso!',
            }
            resultStatus = 201;
        }
    } else {
        ctx.body = {
            success: false,
            message: 'Cadastro não realizado! O usuário deve ter a idade maior ou igual a 18 anos.' 
        }
        resultStatus = 400;
    }

    ctx.status = resultStatus;
});

// Lista todos os users
router.get('/users', async (ctx) => {
    let page = parseInt(ctx.request.query.page) || 0
    let result = await db.listUsers(page)
    
    ctx.status = 200;
    ctx.body = { 
        total: result.total,
        page: page,
        /* count: 0, */
        rows: result.rows
    }
});

// Recupera um usuário pelo nome
router.get('/user/:nome', async (ctx) => {
    let nome = ctx.params.nome;
    let result = await db.getUser(nome)

    if (result == null) {
        ctx.body = {};
        ctx.status = 404;
        return
    }

    ctx.body = { 
        nome: result.nome,
        email: result.email,
        idade: result.idade
    };
    ctx.status = 200;
    
});

// Deleta itens da lista 
router.delete('/user/:nome', async (ctx) => {
    let nome = ctx.params.nome;

    let user = await db.getUser(nome)
    if (user == null) {
        ctx.body = { message: 'Usuário não encontrado!' }
        ctx.status = 404;
        return
    }
    
    let result = await db.deleteUser(nome)
    if (result.changes > 0) {
        ctx.body = { message: 'Usuário removido com sucesso!' }
        ctx.status = 200;
    } else {
        ctx.body = { message: 'Não foi possível remover o usuário' }
        ctx.status = 500;
    }
});

//Atualiza o usuário cadastrado.
router.put('/user/:nome', async (ctx) => {
    let nome = ctx.params.nome;
    let dados = ctx.request.body;

    let user = await db.getUser(nome)
    if (user == null) {
        ctx.body = { message: 'Usuário não encontrado!' }
        ctx.status = 404;
        return
    }
    
    let result = await db.updateUser(nome, dados)

    if (result.changes > 0) {
        ctx.body = { message: 'Usuário atualizado com sucesso!' }
        ctx.status = 200;
    } else {
        ctx.body = { message: 'Não foi possível atualizar o usuário' }
        ctx.status = 500;
    }
});

module.exports = router;

