const Router = require('koa-router');

const router = new Router();

let userList = [];

// Insere (Adicona) um novo user
router.post('/users', (ctx, next) => {
    ctx.status = 200;
    
    let user = ctx.request.body;
    userList.push(user);
    ctx.body = {
        message: 'Usuário cadastrado com sucesso!'
    }
});

// Lista todos os users
router.get('/users', async (ctx) => {
    ctx.status = 200;

    ctx.body = { 
        total: userList.length,
        //count: 0,
        rows:userList
    }
});

// Deleta itens da lista 
router.delete('/users/:index', async (ctx) => {
    ctx.status = 200;
    let index = ctx.params.index;
    let removed = userList.splice(index, 1);
 
    ctx.body = { 
        message: 'Usuário ' + removed[0].nome + ' removido com sucesso!'
    }
});

//Edita o usuário cadastrado.
router.put('/users/:index', async (ctx) => {
    ctx.status = 200;
    let user = ctx.request.body;
    let index = ctx.params.index;
    userList[index] = user;
    
    ctx.body = {
        message: 'Usuário editado com sucesso!'
    }
});

module.exports = router;

