const Router = require('koa-router');
const router = new Router();
const db = require('../db/database')

// Insere (Adiciona) um novo user
router.post('/user', (ctx, next) => {
    ctx.status = 201;
    
    let user = ctx.request.body;
    db.insertUser(user);

    ctx.body = {
        message: 'Usuário cadastrado com sucesso!'
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

// // Deleta itens da lista 
// router.delete('/user/:index', async (ctx) => {
//     ctx.status = 200;
//     let index = ctx.params.index;
//     let removed = userList.splice(index, 1);
 
//     ctx.body = { 
//         message: 'Usuário ' + removed[0].nome + ' removido com sucesso!'
//     }
// });

// //Edita o usuário cadastrado.
// router.put('/user/:index', async (ctx) => {
//     ctx.status = 200;
//     let user = ctx.request.body;
//     let index = ctx.params.index;
//     userList[index] = user;
    
//     ctx.body = {
//         message: 'Usuário editado com sucesso!'
//     }
// });

module.exports = router;

