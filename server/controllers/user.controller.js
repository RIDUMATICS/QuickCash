import Portfolio from '../database/models/Portfolio';
import User from '../database/models/User';
import { CustomError } from '../utils';

export default class UserController {
  /**
   * @param {object} request express request object
   * @param {object} response express request object
   * @returns {json} json
   * @memberof UserController
   */
  static async updateUser(req, res, next) {
    try {
      const { _id } = req.user;

      // check if new email is available
      if (req.body.email) {
        const user = await User.findOne({ email: req.body.email });
        // if user exits with same email
        if (user) {
          throw new CustomError('Email is not available', 409);
        }
      }

      const user = await User.findByIdAndUpdate(_id, req.body, { new: true });

      // if user exits
      if (user) {
        return res.success(200, { user });
      }

      // if user does not exits
      throw new CustomError('User not found', 404);
    } catch (error) {
      next(error);
    }
  }

  static async updatePassword(req, res, next) {
    try {
      const { _id } = req.user;
      const { oldPassword, newPassword } = req.body;

      const user = await User.findById(_id);

      // if user exits
      if (user) {
        // validate user old password
        const isValid = await user.validatePassword(oldPassword);

        // if oldPassword is valid
        if (isValid) {
          user.hashPassword(newPassword);
          await user.save();

          return res.success(200, { message: 'Password updated successfully' });
        }

        // if old password is incorrect
        throw new CustomError('Incorrect old Password', 400);
      }

      // if user does not exits
      throw new CustomError('User not found', 404);
    } catch (error) {
      next(error);
    }
  }

  static async getPortfolioPos(req, res, next) {
    try {
      // get user portfolio positions
      const portfolios = await req.user.getPortfolios();

      res.success(200, { portfolios });
    } catch (error) {
      next(error);
    }
  }

  static getPortfolioValue(req, res, next) {
    try {
      const portfolioValue = req.user.getPortfolioValue();

      res.success(200, { portfolioValue });
    } catch (error) {
      next(error);
    }
  }
}
