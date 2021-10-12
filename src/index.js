//https://github.com/ZijianHe/koa-router

const PORT = process.env.PORT || 3000;

const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const usersRoutes = require('./controllers/userController');
const render = require('koa-ejs');
const path = require('path');

const koa = new Koa();
var router = new Router();

render(koa, {
  root: path.join(__dirname, 'views'),
  layout: 'index',
  viewExt: 'html',
  cache: false,
  debug: false
});

koa.use(serve('./src/public'));
koa.use(bodyParser());

router.get('/', async (ctx, next) => {
  ctx.status = 200;
  await ctx.render('index');
});

koa
  .use(router.routes())
  .use(usersRoutes.routes())
  .use(router.allowedMethods());
  

const server = koa.listen(PORT);
console.log('Servidor inicializado: http://localhost:'+ PORT);

module.exports = server;