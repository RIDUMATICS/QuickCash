import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';

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
    },
    password: String,
  },
  { timestamps: true }
);

UserSchema.methods.validatePassword = function (plainPassword) {
  return bcrypt.compareSync(plainPassword, this.password);
};

UserSchema.methods.generateJWT = function () {
  const payload = { id: this._id, name: this.name };
  return jwt.sign(payload, config.secret, {
    expiresIn: '24h',
  });
};

UserSchema.pre('save', async function (next) {
  if (!this.password) return next;

  const user = this;
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;
  next();
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// export userschema
export default model('User', UserSchema);
