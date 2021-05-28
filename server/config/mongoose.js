import mongoose from 'mongoose';
import config from '.';

export default async () => {
  mongoose.Promise = global.Promise;

  const connection = await mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  });

  return connection.connection.db;
};
