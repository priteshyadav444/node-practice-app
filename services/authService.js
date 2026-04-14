import { User } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const createUser = async (data) => {
    const existing = await User.findOne({ where: { email: data.email } });
    if (existing) throw new Error("Email already exist");
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await User.create({ ...data, password: hashed });
    const u = user.get({ plain: true });
    delete u.password;
    return u;
}

export const login = async (data) => {
    const user = await User.findOne({ where: { email: data.email } });
    if (!user) throw new Error("Invalid credentials");

    const ok = await bcrypt.compare(data.password, user.password);
    if (!ok) throw new Error("Invalid cred");

    const payload = { id: user.id };
    const expiresIn = JWT_EXPIRES_IN;
    const token = jwt.sign(payload, JWT_SECRET, {  expiresIn });
    const u = user.get({ plain: true});
    delete u.password;
    return { user: u, token, expiresIn };
}

export const getUserById = async (id) => {
    return User.findByPk(id);
}
