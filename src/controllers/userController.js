const Router = require('koa-router');
const router = new Router();
const db = require('../db/database')

// Insere (Adiciona) um novo user
router.post('/user', async (ctx, next) => {
    ctx.status = 201;
    
    let user = ctx.request.body;
    let result = await db.insertUser(user);

    if (result.changes > 0) {
        ctx.body = { message: 'Usuário cadastrado com sucesso!' }
    } else {
        ctx.body = { message: 'Não foi possível cadastrar o usuário' }
    }
});

// Lista todos os users
router.get('/users', async (ctx) => {
    let page = parseInt(ctx.request.query.page)
    let userList = await db.listUsers(page)
    
    ctx.status = 200;
    ctx.body = { 
        total: userList.length,
        page: page,
        /* count: 0, */
        rows: userList
    }
});

// Deleta itens da lista 
router.delete('/user/:nome', async (ctx) => {
    ctx.status = 200;
    let nome = ctx.params.nome;
    
    let result = await db.deleteUser(nome)

    if (result.changes > 0) {
        ctx.body = { message: 'Usuário removido com sucesso!' }
    } else {
        ctx.body = { message: 'Não foi possível remover o usuário' }
    }
});

//Atualiza o usuário cadastrado.
router.put('/user/:nome', async (ctx) => {
    ctx.status = 200;
    let nome = ctx.params.nome;
    let dados = ctx.request.body;
    
    let result = await db.updateUser(nome, dados)

    if (result.changes > 0) {
        ctx.body = { message: 'Usuário atualizado com sucesso!' }
    } else {
        ctx.body = { message: 'Não foi possível atualizar o usuário' }
    }
});

module.exports = router;

