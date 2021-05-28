import Portfolio from '../database/models/Portfolio';
import User from '../database/models/User';
import { CustomError } from '../utils';

export default class UserController {
  static async updateUser(req, res, next) {
    try {
      const { _id } = req.user;
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

  static async getPortfolioValue(req, res, next) {
    try {
      const portfolios = await req.user.getPortfolios();

      // portfolio value is cumulative of all equityValue(totalQuantity * pricePerShare)
      const portfolioValue = portfolios.reduce((total, portfolio) => {
        return total + portfolio.equityValue;
      }, 0);

      res.success(200, { portfolioValue });
    } catch (error) {
      next(error);
    }
  }
}
