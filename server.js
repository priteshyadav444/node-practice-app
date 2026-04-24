import express from "express";
import dotenv from "dotenv";
import sequelize from './services/db.js';
import taskRoutes from './routes/api/taskRoutes.js';
import authRoutes from './routes/api/authRoutes.js';
import webTaskRoutes from './routes/web/task.js';
import webAuthRoutes from './routes/web/auth.js';
import session from "express-session";
import cookieParser from "cookie-parser";
dotenv.config();

const PORT = process.env.PORT;
const app = express();

// API middleware
app.use(express.json());

// Web middleware
app.set('view engine', 'ejs');
app.set('views', process.cwd() + '/views');
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());


// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

app.use(session({
    secret: '123',
    resave: false,
    saveUninitialized: false,
    cookie: function (req) {
        return {
            httpOnly: false,
            secure: req.secure || false,
            maxAge: 60000
        }
    }
}))
app.use((req, res, next) => {
    res.locals.currentUser = req.session?.currentUser || null;
    res.locals.flashMessage = null;
    if (req.session?.flashMessage) {
        res.locals.flashMessage = req.session?.flashMessage || null;
        res.locals.flashType = req.session?.flashType || 'success';
        req.session.flashMessage = null;
    }
    next();
})

// Web Routes
app.use('/tasks', webTaskRoutes);
app.use('/auth', webAuthRoutes);

app.locals.hasPermission = (permission) => { return true };



try {
    await sequelize.authenticate();
    console.log("DB connected");
    await sequelize.sync({ alter: true });
    console.log("DB synced successfully");

    app.listen(PORT, () => {
        console.log(`Server started running on ${PORT}`);
    })
} catch (error) {
    console.log(error);
}