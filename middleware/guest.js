export default function guest(req, res, next) {
    if (req.session && req.session.user) {
        return res.redirect('/tasks');
    }
    next();
}
