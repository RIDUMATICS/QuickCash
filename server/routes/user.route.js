import { celebrate } from 'celebrate';
import { Router } from 'express';
import passport from 'passport';
import UserController from '../controllers/user.controller';
import {
  updatePasswordSchema,
  updateUserSchema,
} from '../validation/userSchema';

const route = Router();

const opt = { abortEarly: false }; // Joi validation options

export default (app) => {
  app.use('/user', route);

  route.patch(
    '/details',
    passport.authenticate('jwt', { session: false }),
    celebrate(updateUserSchema, opt),
    UserController.updateUser
  );

  route.patch(
    '/change-password',
    passport.authenticate('jwt', { session: false }),
    celebrate(updatePasswordSchema, opt),
    UserController.updatePassword
  );

  route.get(
    '/portfolios',
    passport.authenticate('jwt', { session: false }),
    UserController.getPortfolioPos
  );

  route.get(
    '/portfolios/value',
    passport.authenticate('jwt', { session: false }),
    UserController.getPortfolioValue
  );
  
};
