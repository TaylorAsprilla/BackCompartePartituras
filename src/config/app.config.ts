export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  dataBase: process.env.DB_DATABASE,
  dataPassword: process.env.DB_PASSWORD,
  dataUser: process.env.DB_USERNAME,
  dataHost: process.env.DB_HOST,
  dataPort: process.env.DB_PORT,
  port: process.env.PORT || 3002,
});
