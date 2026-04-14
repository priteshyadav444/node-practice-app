import express from "express";
import * as authController from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import registerRules from "../middleware/validation/registerRules.js";

const router = express.Router();
router.post("/register", registerRules, validate, authController.register)
router.post("/login", authController.login)

export default router;