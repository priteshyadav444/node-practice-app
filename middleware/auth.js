import jwt from 'jsonwebtoken';
import { getUserById } from '../services/authService.js';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function auth(req, res, next) {
    try {
        // read token from Authorization header or cookie
        if (!token && req.cookies && req.cookies.token) token = req.cookies.token;
        if (!token) return res.redirect('/auth/login');

        const payload = jwt.verify(token, JWT_SECRET);
        if (!payload || !payload.id) return res.redirect('/auth/login');
        const user = await getUserById(payload.id);
        if (!user) return res.redirect('/auth/login');

        req.session.user = user.get ? user.get({ plain: true }) : user;
        res.locals.currentUser = req.session?.user || null;
        return next();
    } catch (err) {
        return res.redirect('/auth/login');
    }
}