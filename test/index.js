//sample test
//Para rodar os testes, use: npm test
//PS: Os testes não estão completos e alguns podem comnter erros.

// veja mais infos em:
//https://mochajs.org/
//https://www.chaijs.com/
//https://www.chaijs.com/plugins/chai-json-schema/
//https://developer.mozilla.org/pt-PT/docs/Web/HTTP/Status (http codes)

const app =  require('../src/index.js');

const assert = require('assert');
const chai = require('chai')
const chaiHttp = require('chai-http');
const chaiJson = require('chai-json-schema');
const userSchema = require('./userSchema')
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');

chai.use(chaiHttp);
chai.use(chaiJson);

const expect = chai.expect;

// Limpa banco de dados antes de começar os testes
let cleanDatabase = async function() {
    try {
        let db = await sqlite.open({ filename: 'src/db/database-test.db', driver: sqlite3.Database });
        await db.run("DROP TABLE IF EXISTS user");
    } catch(error) {
        console.log(error)
    }
}
cleanDatabase()

//Inicio dos testes

//este teste é simplesmente pra enteder a usar o mocha/chai
describe('Um simples conjunto de testes', function () {
    it('deveria retornar -1 quando o valor não esta presente', function () {
        assert.equal([1, 2, 3].indexOf(4), -1);
    });
});

//testes da aplicação
describe('Testes da aplicaçao',  () => {
    it('o servidor esta online', function (done) {
        chai.request(app)
        .get('/')
        .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
        });
    });

    it('deveria ser uma lista vazia de usuarios', function (done) {
        chai.request(app)
        .get('/users')
        .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.rows).to.eql([]);
        done();
        });
    });

    it('deveria criar o usuario raupp', function (done) {
        chai.request(app)
        .post('/user')
        .send({nome: "raupp", email: "jose.raupp@devoz.com.br", idade: 35})
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            done();
        });
    });

    [1, 2, 3, 4, 5].forEach(value => {
        it(`deveria criar o usuário nº ${value}`, function (done) {
            chai.request(app)
            .post('/user')
            .send({nome: `Usuário ${value}`, email: `usuario${value}@email.com`, idade: 20 + value})
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                done();
            });
        });
    });

    it('Não deveria criar um usuário com idade menor do que 18 anos', function (done) {
        chai.request(app)
        .post('/user')
        .send({nome: 'De menor', email: 'demenor@email.com', idade: 17})
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            done();
        });
    });

    //...adicionar pelo menos mais 5 usuarios. se adicionar usuario menor de idade, deve dar erro.
    // Ps: não criar o usuario naoExiste
    it('o usuario naoExiste não existe no sistema', function (done) {
        chai.request(app)
        .get('/user/naoExiste')
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            done();
        });
    });

    it('Não deveria ser possível excluir o usuário naoExiste', function (done) {
        chai.request(app)
        .delete('/user/naoExiste')
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            done();
        });
    });

    it('Não deveria ser possível atualizar o usuário naoExiste', function (done) {
        chai.request(app)
        .put('/user/naoExiste')
        .send({ nome: "naoExiste", email: "naoexiste@email.com", idade: 40 })
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            done();
        });
    });

    it('o usuario raupp existe e é valido', function (done) {
        chai.request(app)
        .get('/user/raupp')
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.jsonSchema(userSchema);
            done();
        });
    });

    it('Deveria atualizar a idade do usuário raupp', function (done) {
        chai.request(app)
        .put('/user/raupp')
        .send({nome: "raupp", email: "jose.raupp@devoz.com.br", idade: 36})
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
        });
    });

    it('Deveria obter a idade atualizada do usuário raupp', function (done) {
        chai.request(app)
        .get('/user/raupp')
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.jsonSchema(userSchema);
            expect(res.body.idade).to.be.equal(36)
            done();
        });
    });

    it('deveria excluir o usuario raupp', function (done) {
        chai.request(app)
        .delete('/user/raupp')
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
        });
    });

    it('o usuario raupp não deve existir mais no sistema', function (done) {
        chai.request(app)
        .get('/user/raupp')
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            done();
        });
    });

    it('deveria ser uma lista com pelomenos 5 usuarios', function (done) {
        chai.request(app)
        .get('/users')
        .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.total).to.be.at.least(5);
        done();
        });
    });
})