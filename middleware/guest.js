export default function guest(req, res, next) {
    if (req.session && req.session.user && req.cookies && req.cookies.token) {
        return res.redirect('/tasks');
    }
    next();
}
