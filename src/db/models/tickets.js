import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import users from "./users.js"

const tickets = sequelize.define('tickets', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    summary: {
        type: DataTypes.STRING(50),
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: users,
            key: 'id'
        }
    },
}, {
    timestamps: false
});


// // Define the relationship
// tickets.belongsTo(users, { foreignKey: 'user_id' });
// users.hasMany(tickets, { foreignKey: 'user_id' });

export default tickets