import chai from 'chai';
import chaiHttp from 'chai-http';
import app from './test_server';

chai.use(chaiHttp);

const authenticateUser = async () => {
  return new Promise((resolve, reject) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'John@doe.com',
        password: 'strong_password',
      })
      .end((err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(`Bearer ${res.body.data.token}`);
      });
  });
};

export default authenticateUser;
