import { param } from "express-validator";
import { Task } from "../../../models/index.js";

export const uploadTaskFileRule = [
    param("id").custom(async (value) => {
        const task = await Task.findOne({ where: { id: value } });
        if (!task) {
            throw new Error("Invalid Task id");
        }
    })
];

export const taskFileIdRule = [
    param("taskId").custom(async (value) => {
        const task = await Task.findOne({ where: { id: value } });
        if (!task) {
            throw new Error("Invalid Task id");
        }
    }),
    param("fileId").notEmpty().withMessage("File id is required")
];
