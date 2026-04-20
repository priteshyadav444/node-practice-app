import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../services/db.js";

const User = sequelize.define(
    'User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        column: 'is_active'
    },
    login_attempt: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    }
},
    { tableName: 'users' }
)

export default User;