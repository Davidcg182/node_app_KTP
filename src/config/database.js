import { Sequelize } from "sequelize";
import dotenv from 'dotenv'
dotenv.config();

const {
    DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT
} = process.env;


export const sequelize = new Sequelize({
    host: DB_HOST,
    port: DB_PORT || 5432,
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASSWORD,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    logging: console.log
});