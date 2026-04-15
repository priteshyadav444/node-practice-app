import { body, param } from "express-validator";
import { Task } from "../../../models/index.js";

const createTaskRule = [
    body("title").notEmpty().withMessage('Task is required'),
    body("description").optional(),
    body("status").optional().isIn(["pending", "in-progress", "completed"]).withMessage('Status must be one of pending, in-progress, completed'),
    body("priority").optional().isIn(["low", "medium", "high"]).withMessage('Priority must be one of low, medium, high'),
    body("dueDate").optional().isISO8601().toDate().withMessage('Due date must be a valid date'),
    body("assignedTo").notEmpty().withMessage('AssignedTo must be a valid user ID'),
];

const updateTaskRule = [
    param("id").custom(async (value) => {
        const task = await Task.findOne({ where: { id: value } });
        if (!task) {
            throw new Error("Invalid Task id");
        }
    }),
    ...createTaskRule
];

const assignTaskRule = [
    param("id").custom(async (value) => {
        const task = await Task.findOne({ where: { id: value } });
        if (!task) {
            throw new Error("Invalid Task id");
        }
    }),
    body("assignedTo").notEmpty().withMessage('AssignedTo must be a valid user ID'),
];

const getTaskById = [
    param("id").custom(async (value) => {
        const task = await Task.findOne({ where: { id: value } });
        if (!task) {
            throw new Error("Invalid Task id");
        }
    })
];

export { createTaskRule, updateTaskRule, assignTaskRule, getTaskById };