import { validationResult, matchedData } from "express-validator";
import * as authService from "../../services/authService.js";
import jwt from 'jsonwebtoken';
import { sendServerError } from "../../utils/responseHelper.js";

export const renderRegister = (req, res) => {
    res.render('auth/register', { errors: null, old: {} });
}

export const renderLogin = (req, res) => {
    res.render('auth/login', { errors: null, old: {} });
}

export const postRegister = async (req, res) => {
    try {
        const errors = validationResult(req);
        const old = req.body;
        if (!errors.isEmpty()) return res.status(422).render('auth/register', { errors: errors.array(), old });
        const data = matchedData(req, { locations: ['body'] });
        const user = await authService.createUser(data);
        req.session.user = user;
        return res.redirect('/tasks');
    } catch (error) {
        sendServerError(res, error);
    }
}

export const postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login({ email, password });
        req.session.user = result.user;
        
        let maxAge = 1 * 60 * 60 * 1000;
        const cookieOptions = { maxAge, httpOnly: true, sameSite: 'lax', path: '/' };
        if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
        res.cookie('token', result.token, cookieOptions);
        return res.redirect('/tasks');
    } catch (error) {
        return res.status(422).render('auth/login', { errors: [{ msg: error.message }], old: req.body });
    }
}

export const logout = (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('token');
        res.redirect('/auth/login');
    });
}
