const request = require('supertest');
const sinon = require('sinon');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const passport = require("passport");

let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

const PORT = process.env.PORT || 3000;
const HOST = `http://localhost:${PORT}`;

const Trip = require('../models/Trip');

let auth; 
let app;

describe('Routing and Integration Tests', () => {
    before((done) => {
        mongoose.set('log', false);
        db = mongoose.connect("mongodb://localhost:27017/local_test", {
            useNewUrlParser: true
        });
        done();
    });

    beforeEach(function () {
       /*  this.authenticate = sinon.stub(passport, 'authenticate').returns(() => {});
        this.authenticate.yields(null, { id: 1 }); */

        auth = require('../services/auth');
        sinon.stub(auth, 'isLoggedIn')
            .callsFake(function (req, res, next) {
                return next(); 
            }); 

        app = require('../app');
    });

    afterEach(function () {
        //this.authenticate.restore();
        auth.isLoggedIn.restore();
    });

    after(() => {
        mongoose.connection.close(() => {
            console.log('Mock database connection closed');
        });
    });

    it('should return with edit page: bad data', (done) => {
        const badReq = {
            body: {
                startCity: 'not real data',
            },
            user: {},
        };

        chai.request(HOST)
            .post('/api/trips')
            .type('json')
            .send(badReq)
            .end((err, res) => {
                expect(res.statusCode).to.eql(200);
                done();
            });
    });

     it('should accept valid data and return 200 status with saved object', (done) => {
         let goodReq = new Trip({
            user: { id: mongoose.Types.ObjectId(1) },
            body: {
                startCity: 'paris',
                endCity: 'end',
                price: '1000',
                date: '12/12/2018', 
                description: 'test',
            }
         });

        chai.request(HOST)
            .post('/api/trips')
            .type('json')
            .send(goodReq)
            .end((err, res) => {
                expect(res.statusCode).to.eql(200);
                done();
            });
     });

    it('should respond to API request with all trips', (done) => {
        let userId = mongoose.Types.ObjectId(1);

        let goodReq = new Trip({
            user: { id: userId },
            body: {
                startCity: 'paris',
                endCity: 'end',
                price: '1000',
                date: '12/12/2018', 
                description: 'test',
            }
         });

        chai.request(HOST)
            .post('/api/trips')
            .type('json')
            .send(goodReq)
            .end((err, res) => {
                chai.request(HOST)
                    .get('/api/trips')
                    .type('json')
                    .send({ 'user': {_id: userId } })
                    .end((err, res) => {
                        expect(res.statusCode).to.eql(200);
                        done();
                    });
            });
    });
});