//https://github.com/ZijianHe/koa-router

const PORT = process.env.PORT || 3000;

const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const swagger = require('koa2-swagger-ui');
const yamljs = require('yamljs');

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
koa.use(serve('./api.yaml'));

koa.use(serve('api-docs'));
koa.use(bodyParser());

const spec = yamljs.load('./api.yaml');

koa.use(
  swagger.koaSwagger({
    routePrefix: '/docs',
    swaggerOptions: { spec },
  }),
);

router.get('/', async (ctx, next) => {
  ctx.status = 200;
  await ctx.render('index');
});

// router.get('api-docs', async (ctx, next) => {
//   ctx.status = 200;
//   await ctx.render('index');
// });

koa
  .use(router.routes())
  .use(usersRoutes.routes())
  .use(router.allowedMethods());
  

const server = koa.listen(PORT);
console.log('Servidor inicializado: http://localhost:'+ PORT);

module.exports = server;