import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  //   port: parseInt(process.env.PORT, 10) || 3000,
  //   database: {
  //     host: process.env.DB_HOST,
  //     port: parseInt(process.env.DB_PORT, 10) || 3306,
  //   },
}));
