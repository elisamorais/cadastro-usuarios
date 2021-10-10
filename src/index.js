//https://github.com/ZijianHe/koa-router

const PORT = process.env.PORT || 3000;

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const usersRoutes = require('./controllers/userController');  


const koa = new Koa();
var router = new Router();

koa.use(bodyParser());

router.get('/', (ctx, next) => {
  ctx.status = 200;
});

koa
  .use(router.routes())
  .use(usersRoutes.routes())
  .use(router.allowedMethods());
  

const server = koa.listen(PORT);
console.log('Servidor inicializado: http://localhost:'+ PORT);

module.exports = server;