import mongoose from 'mongoose';

/**
 * @method mongooseConnect
 * @description Connect to mongoDB database
 * @param {string} databaseURL - The database url (different base on env)
 * @returns {Promise} JSON API Response
 */
const mongooseConnect = async (databaseURL) => {
  mongoose.Promise = global.Promise;

  const connection = await mongoose.connect(databaseURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  });

  return connection.connection.db;
};

export default mongooseConnect;
