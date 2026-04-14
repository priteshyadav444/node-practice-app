import { DataTypes, ENUM, Sequelize } from "sequelize";
import sequelize from "../services/db.js";

const Task = sequelize.define(
    'Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
        values: 'pending'
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        values: 'low'
    },
    assignedTo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'assigned_to'
    },
    userId:{
        type: DataTypes.INTEGER,
        field: 'user_id'
    },
    attachment: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    isDeleted: {
        type: DataTypes.DATE,
        defaultValue: 0,
        field: 'deleted_at'
    },
    version: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

export default Task;