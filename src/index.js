//https://github.com/ZijianHe/koa-router

const PORT = process.env.PORT || 3000;

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const usersRoutes = require('./controllers/userController');

const koa = new Koa();
var router = new Router();

koa.use(bodyParser());

koa
  .use(router.routes())
  .use(usersRoutes.routes())
  .use(router.allowedMethods());

const server = koa.listen(PORT);
console.log('Seu servidor');

module.exports = server;