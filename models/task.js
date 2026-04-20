import { DataTypes, ENUM, Sequelize } from "sequelize";
import sequelize from "../services/db.js";

const Task = sequelize.define(
    'Task',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
        },
        description:{
            type:DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
            defaultValue: "pending"
        },
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high'),
            defaultValue: "low"
        },
        assignedTo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'assigned_to'
        },
        userId: {
            type: DataTypes.INTEGER,
            field: 'user_id'
        },
        attachment: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        deletedAt: {
            type: DataTypes.DATE,
            field: 'deleted_at'
        },
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at'
        },
        dueDate: {
            type: DataTypes.DATE,
            field: 'due_date'
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at'
        },
    },
    {
        tableName: 'tasks',
        defaultScope: {
            where: {
                deletedAt: null
            }
        }
    }
)

export default Task;