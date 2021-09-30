const Router = require('koa-router');

const router = new Router();

let userList = [];

// Insere um novo user
router.post('/users', (ctx, next) => {
    ctx.body = ctx.request.body;
    ctx.status = 200;

    // ctx.body = {
    //     message: 'Usuário cadastrado com sucesso!'
    // }
});

// Lista todos os users
router.get('/users', async (ctx) => {
    ctx.status = 200;
    ctx.body = {total:0, count: 0, rows:[]}
});

module.exports = router;

