import * as dotenv from 'dotenv';
import UserEntity from './src/modules/user/user.enity';
import SessionEntity from './src/modules/session/session.enity';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from './src/snake-naming.strategy';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  namingStrategy: new SnakeNamingStrategy(),
  subscribers: [],
  entities: [UserEntity, SessionEntity],
  migrations: ['./src/database/migrations/*{.ts,.js}'],
});

export { dataSource };
