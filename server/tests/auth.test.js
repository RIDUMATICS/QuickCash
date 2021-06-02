import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import mongooseConnect from '../config/mongoose';
import config from '../config';
import { Logger } from '../utils';
import server from './test_server';

chai.use(chaiHttp);
chai.should();

const user = {
  name: 'John Doe',
  address: '5, fake street',
  email: 'John@doe.com',
  password: 'strong_password',
  confirmPassword: 'strong_password',
};

describe('Authentication Route', () => {
  before(async () => {
    try {
      //connect to test database
      const db = await mongooseConnect(config.TESTDB_URL);

      // drop database
      await db.dropDatabase();
    } catch (err) {
      Logger.error(err.message);
      process.exit(1);
    }
  });

  it('should signup a new user', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        done();
      });
  });

  it('should throw an error if already existed user try to sign up', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(409);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });

  it('should login a user if exist', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: user.password })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });

  it('should throw an error if email does not exist (incorrect)', (done) => {
    const email = 'unknown@gmail.com';
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({ email, password: user.password })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });

  it('should throw an error if password is incorrect', (done) => {
    const password = 'hacking_123';
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
});
