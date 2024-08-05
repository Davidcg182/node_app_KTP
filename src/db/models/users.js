import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import bcrypt from 'bcrypt'

const empleados = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    contract_date: {
        type: DataTypes.DATE
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    salary: {
        type: DataTypes.FLOAT,
    },
    userType: {
        type: DataTypes.ENUM('0', '1'),
        allowNull: false,
        defaultValue: '1'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    confirmPassword: {
        type: DataTypes.VIRTUAL,
        set(value) {
            if (value !== this.password) {
                throw Error(`password and confirm password must be the same`)
            }
            const hashPassword = bcrypt.hashSync(value, 10);
            this.setDataValue('password', hashPassword);
        }
    }
}, {
    timestamps: false
});

export default empleados