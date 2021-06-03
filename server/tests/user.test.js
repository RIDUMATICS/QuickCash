import chai from 'chai';
import chaiHttp from 'chai-http';
import server from './test_server';
import authenticateUser from './testUtils';

chai.use(chaiHttp);
chai.should();

let token;

describe('User Route', () => {
  before(async () => {
    token = await authenticateUser();
  });

  it('should update user details', (done) => {
    chai
      .request(server)
      .patch('/api/v1/user')
      .set('Authorization', token)
      .send({
        name: 'Ridwan Onikoyi',
        address: '1186 Roseville Pkwy',
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data').should.be.a('object');
        res.body.data.should.have.property('user').should.be.a('object');
        res.body.data.user.should.have.property('name').eql('Ridwan Onikoyi');
        res.body.data.user.should.have
          .property('address')
          .eql('1186 Roseville Pkwy');

        done();
      });
  });

  it('should throw an error if the user tries to update to existing email', (done) => {
    chai
      .request(server)
      .patch('/api/v1/user')
      .set('Authorization', token)
      .send({
        email: 'John@doe.com',
      })
      .end((err, res) => {
        res.should.have.status(409);
        res.body.should.be.a('object');
        res.body.should.have.property('error').eql('Email is not available');

        done();
      });
  });

  it('should update user password', (done) => {
    chai
      .request(server)
      .patch('/api/v1/user/change-password')
      .set('Authorization', token)
      .send({
        oldPassword: 'strong_password',
        newPassword: 'strongPassword',
        confirmPassword: 'strongPassword',
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data').should.be.a('object');
        res.body.data.should.have
          .property('message')
          .eql('Password updated successfully');

        done();
      });
  });

  it('should throw an error if the old password is incorrect', (done) => {
    chai
      .request(server)
      .patch('/api/v1/user/change-password')
      .set('Authorization', token)
      .send({
        oldPassword: 'JAVASCRIPT',
        newPassword: 'strongPassword',
        confirmPassword: 'strongPassword',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error').eql('Incorrect old Password');
        done();
      });
  });

  it('should get user portfolio positions', (done) => {
    chai
      .request(server)
      .get('/api/v1/user/portfolios')
      .set('Authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data').should.be.a('object');
        res.body.data.should.have.property('portfolios');
        res.body.data.portfolios.should.be.a('array');

        done();
      });
  });

  it('should get user portfolio value', (done) => {
    chai
      .request(server)
      .get('/api/v1/user/portfolios/value')
      .set('Authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data').should.be.a('object');
        res.body.data.should.have.property('portfolioValue');

        done();
      });
  });
});
