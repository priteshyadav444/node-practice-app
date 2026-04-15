import { body } from "express-validator";

const createTaskRule = [
    body("title").notEmpty().withMessage('Task is required'),
    body("description").optional(),
    body("status").optional().isIn(["pending", "in_progress", "completed"]).withMessage('Status must be one of pending, in_progress, completed'),
    body("priority").optional().isIn(["low", "medium", "high"]).withMessage('Priority must be one of low, medium, high'),
    body("dueDate").optional().isISO8601().toDate().withMessage('Due date must be a valid date'),
    body("assignedTo").notEmpty().withMessage('AssignedTo must be a valid user ID'),
];

export default createTaskRule;