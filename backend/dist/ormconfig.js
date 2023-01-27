"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const dotenv = require("dotenv");
const user_enity_1 = require("./src/modules/user/user.enity");
const session_enity_1 = require("./src/modules/session/session.enity");
const typeorm_1 = require("typeorm");
const snake_naming_strategy_1 = require("./src/snake-naming.strategy");
dotenv.config();
const dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    namingStrategy: new snake_naming_strategy_1.SnakeNamingStrategy(),
    subscribers: [],
    entities: [user_enity_1.default, session_enity_1.default],
    migrations: ['./src/database/migrations/*{.ts,.js}'],
});
exports.dataSource = dataSource;
//# sourceMappingURL=ormconfig.js.map