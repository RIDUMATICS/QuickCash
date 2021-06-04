import chai from 'chai';
import chaiHttp from 'chai-http';
import server from './test_server';
import authenticateUser from './testUtils';

chai.use(chaiHttp);
chai.should();

const loan = {
  amount: 3000,
  tenor: 7,
};
let token;
let loanId;

describe('Loan Route', () => {
  before(async () => {
    token = await authenticateUser();
  });

  it('should create a new loan', (done) => {
    chai
      .request(server)
      .post('/api/v1/loans')
      .set('Authorization', token)
      .send(loan)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('data').should.be.a('object');
        res.body.data.should.have.property('loan').should.be.a('object');

        loanId = res.body.data.loan._id;
        done();
      });
  });

  it('should throw error if exceed 60% portfolio value', (done) => {
    chai
      .request(server)
      .post('/api/v1/loans')
      .set('Authorization', token)
      .send(loan)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have
          .property('error')
          .eql('Exceeded maximum amount allowed');
        done();
      });
  });

  it('should get all his active loans and balance', (done) => {
    chai
      .request(server)
      .get('/api/v1/loans')
      .set('Authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data').should.be.a('object');
        res.body.data.should.have.property('loans');
        res.body.data.loans.should.be.a('array');
        done();
      });
  });

  it('should filter active loans base on repaid', (done) => {
    chai
      .request(server)
      .get('/api/v1/loans')
      .query({ repaid: true })
      .set('Authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data').should.be.a('object');
        res.body.data.should.have.property('loans');
        res.body.data.loans.should.be.a('array');
        done();
      });
  });

  it('should get loan by id', (done) => {
    chai
      .request(server)
      .get(`/api/v1/loans/${loanId}`)
      .set('Authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data').should.be.a('object');
        res.body.data.should.have.property('loan');
        res.body.data.loan.should.be.a('object');
        done();
      });
  });

  it('should throw error if loan id is not found', (done) => {
    const invalid_taskId = '60b642d54545fb36389502ef';

    chai
      .request(server)
      .get(`/api/v1/loans/${invalid_taskId}`)
      .set('Authorization', token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error').eql('Loan not found');
        done();
      });
  });

  it('should calculate prorated payment schedule over the loan period ', (done) => {
    chai
      .request(server)
      .get(`/api/v1/loans/calculate`)
      .query({ amount: 6000, tenor: 8 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data').should.be.a('object');
        res.body.data.should.have.property('amount');
        res.body.data.should.have.property('tenor');
        res.body.data.should.have.property('installmentPayment');
        res.body.data.should.have.property('interest');
        res.body.data.should.have.property('total');
        done();
      });
  });
});

describe('Repayment Route', () => {
  let ref; // payment reference code

  it('should post repayment', (done) => {
    chai
      .request(server)
      .post(`/api/v1/loans/repayment/${loanId}`)
      .set('Authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data').should.be.a('object');
        res.body.data.should.have.property('message');
        res.body.data.message.should.eql('Authorization URL created');
        res.body.data.data.should.have.property('reference');

        ref = res.body.data.data.reference;
        done();
      });
  });

  it('should verify repayment', (done) => {
    chai
      .request(server)
      .post(`/api/v1/loans/repayment/verify`)
      .set('Authorization', token)
      .send({ ref })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('data').should.be.a('object');
        done();
      });
  });
});
