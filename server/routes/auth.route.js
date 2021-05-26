import { celebrate } from 'celebrate';
import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { createUserSchema, logUserSchema } from '../validation/authSchema';

const route = Router();

const opt = { abortEarly: false }; // Joi validation options

export default (app) => {
  app.use('/auth', route);

  route.post(
    '/signup',
    celebrate(createUserSchema, opt),
    AuthController.createUser
  );
  route.post('/login', celebrate(logUserSchema, opt), AuthController.logUser);
};
