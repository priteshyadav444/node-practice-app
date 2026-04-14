import { body } from "express-validator";
import { User } from "../../models/index.js";

const registerRules = [
    body("name").notEmpty().withMessage('Name is required').trim()
    .isAlphanumeric().withMessage("Email should be alpha numeric"),
    body("email").
        notEmpty().withMessage("Email required").trim()
        .custom(async (value) => {
            const user = await User.findOne({ where: {email: value.toLowerCase()} });

            console.log(user);
            if (user) {
                throw new Error("Email already exist");
            }
        }),
    body("password").isLength({ min: 8 }).withMessage('Password min length 8')
        .matches(/[A-Z]/).withMessage("Must include uppercase letter")
        .matches(/[a-z]/).withMessage("Must include lowercase letter")
        .matches(/[0-9]/).withMessage("Must include number")
        .matches(/[\W_]/).withMessage("Must include special character"),
    ,
];

export default registerRules;