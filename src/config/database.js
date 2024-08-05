import { Sequelize } from "sequelize";
import dotenv from 'dotenv'
dotenv.config();

const {
    DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT
} = process.env;

export const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false,
    port: DB_PORT
});