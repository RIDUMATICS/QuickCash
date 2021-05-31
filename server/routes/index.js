import { Router } from 'express';

import auth from './auth.route';
import user from './user.route';
import loan from './loan.route';

export default () => {
  const app = Router();
  auth(app);
  user(app);
  loan(app);
  return app;
};
