import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { PortfolioSchema } from './Portfolio';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a full name'],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    password: { type: String, required: true },
    portfolios: [PortfolioSchema],
  },
  { timestamps: true }
);

UserSchema.methods.validatePassword = function (plainPassword) {
  return bcrypt.compareSync(plainPassword, this.password);
};

UserSchema.methods.generateJWT = function () {
  const payload = { id: this._id, name: this.name, email: this.email };
  return jwt.sign(payload, config.secret, {
    expiresIn: '24h',
  });
};

UserSchema.methods.hashPassword = function (plainPassword) {
  const hash = bcrypt.hashSync(plainPassword, 10);
  this.password = hash;
};

UserSchema.methods.getPortfolios = function () {
  return this.portfolios;
};

UserSchema.methods.getPortfolioValue = function () {
  // portfolio value is cumulative of all equityValue(totalQuantity * pricePerShare)
  const portfolioValue = this.portfolios.reduce((total, portfolio) => {
    return total + portfolio.equityValue;
  }, 0);

  return portfolioValue;
};

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.portfolios;
  return user;
};

// export UserSchema
export default model('User', UserSchema);
