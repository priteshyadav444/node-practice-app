
p:bcryptjs cookie-parser dotenv ejs, express, ex-validator, ex-session, jsonwebtoken, method-override, multer, mysql2, nodemon, seqlize
set  middleware > API > json, web >  cookierParser, express.urlendcoded,session,set locals  ( currentuser,role,flashMessage,type) and  app.locals.hasPermission = (permission) => { return true };
set use app > app.use (url, routes),

validation >
const createTaskRule = [
    body("title").notEmpty().withMessage('Task is required'),
];
const { id } = matchedData(req, { locations: ["params"] });
        const data = matchedData(req, { locations: ['body'] });

export const validate = (includeErrors = false) => (req, res, next) => {
    const errors = validationResult(req);
    let payload = includeErrors ? errors : null;  sendError(res, firstMessage = errors.array()[0].msg, 422, payload);  next();
const cache = new Map();
    cache.set(key, { value, Date.now() + ttl }); const entry = cache.get(key); cache.delete(key)Array.from(cache.keys()
export function handleMulterError(field) {
	return function(req, res, next) {
		upload.array(field)(req, res, function(err) {
			if (err && err.code === 'LIMIT_FILE_SIZE') {
				setFlashMessage(req, 'File too large. Max size is 2MB.', 'error');
				return res.redirect('/tasks');
			}
			next(err);
		});
	};
}
const destDir = path.resolve(process.cwd(), 'uploads');
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    const srcPath = path.resolve(file.path);
        const destPath = path.join(destDir, file.filename);

    // Move (rename) temp file to final uploads directory
        await fs.promises.rename(srcPath, destPath)

const file = await (await import('../../services/taskFileService.js')).getTaskFile(taskId, fileId);
        const mime = file.mimetype || 'application/octet-stream';
        res.setHeader('Content-Type', mime);
        res.setHeader('Content-Disposition', `inline; filename="${file.originalname.replace(/\"/g, '')}"`);
        return res.sendFile(file.path);
export const moveFromTempToFinal = async (file) => {
    const destPath = process.cwd() + '/uploads/' + file.filename;
    const oldPath = process.cwd() + '/uploads/tmp/' + file.filename;
        if (fs.existsSync(resolved)) fs.unlinkSync(resolved);

    await fs.promises.rename(oldPath, destPath);
}const tasks = await Task.findAll({ where: { [Op.or]: [ { assignedTo: currentUserId }, { userId: currentUserId } ], } });`<form action="/tasks/<%= task.id %>?_method=DELETE" method="POST" style="display:inline;">`
const webRoutes = express.Router();webRoutes.use(methodOverride('_method'));

  req.session.user = result.user;

    let maxAge = 1 * 60 * 60 * 1000;
        const cookieOptions = { maxAge, httpOnly: true, sameSite: 'lax', path: '/' };
        if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
        res.cookie('token', result.token, cookieOptions);
 req.session.destroy(() => {
        res.clearCookie('token');
        res.redirect('/auth/login');
    });
