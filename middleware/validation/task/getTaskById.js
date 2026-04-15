import { body, param } from "express-validator";
import {Task} from "../../../models/index.js";

const getTaskById = [
    param("id").custom(async (value) => {
        const task = await Task.findOne({ where: { id: value } });
        if (!task) {
            throw new Error("Invalid Task id");
        }
    })
];

export default getTaskById;