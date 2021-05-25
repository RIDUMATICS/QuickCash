import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from './middleware/morganMiddleware';
// import routes from './routes';

const app = express();

// Enable Cross Origin Resource Sharing to all origins by default
app.use(cors());

// Helmet helps you secure your Express apps by setting various HTTP headers
app.use(helmet());

// Middleware that transforms the raw string of req.body into json
app.use(express.json());

app.use(morgan);

app.get('/', (req, res) => {
  res.status(200).json({
    'project name': 'QuickCash',
    version: '1.0.0',
    author: 'Onikoyi Ridwan',
    email: 'onikoyiridwan@gmail.com',
    status: 'success',
  });
});

// Load API routes
// app.use('/api/v1', routes());

/// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers
app.use((err, req, res, next) => {
  /**
   * Handle 401 thrown by express-jwt library
   */
  if (err.name === 'UnauthorizedError') {
    return res.status(err.status).send({ message: err.message }).end();
  }
  return next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
    },
  });
});

export default app;
