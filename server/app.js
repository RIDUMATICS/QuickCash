import config from './config';
import app from './loaders';
import logger from './config/logger';
import mongoConnect from './config/mongoose';

const PORT = config.port || 4200;

(async () => {
  try {
    await mongoConnect();
    logger.info('✌️ DB connected successfully!');
    app.listen(PORT, () =>
      logger.info(`Server listening on port: ${config.port}`)
    );
  } catch (err) {
    logger.error(err.message, { path: 'app.js' });
    process.exit(1);
  }
})();
