import User from '../database/models/User';
import { CustomError } from '../utils';

export default class AuthController {
  static async createUser(req, res, next) {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (user) {
        // throw error email is unique
        throw new CustomError('Email has already been taken.', 409);
      }

      let newUser = new User(req.body);
      // hash user password
      newUser.hashPassword(req.body.password);
      newUser = await newUser.save();
      const token = newUser.generateJWT();

      res.success(201, { user: newUser, token });
    } catch (error) {
      return next(error);
    }
  }

  static async logUser(req, res, next) {
    try {
      const { email, password } = req.body;

      let user = await User.findOne({ email });

      // if user exits
      if (user) {
        const isValid = await user.validatePassword(password);

        // if user password is valid
        if (isValid) {
          const token = user.generateJWT();
          return res.success(200, { user, token });
        }
      }

      // if user does not exits or incorrect password
      throw new CustomError(
        'Email or password you entered did not match our records',
        404
      );
    } catch (error) {
      return next(error);
    }
  }
}
