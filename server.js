import express from "express";
import dotenv from "dotenv";
import sequelize from "./services/db.js";
import authRoutes from "./routes/api/authRoutes.js"
import taskRoutes from "./routes/api/taskRoutes.js"
import webRoutes from "./routes/web/task.js"
import webAuthRoutes from "./routes/web/auth.js"
import path from "path";
import session from "express-session";
import cookieParser from "cookie-parser";
import { hasPermission } from './utils/permissionHelper.js';

dotenv.config();

const PORT = process.env.PORT;
const app = express();

// Api Middleware
app.use(express.json());

// Web Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
// expose logged-in user to views
app.use((req, res, next) => {
    res.locals.currentUser = req.session?.user || null;
    res.locals.currentUserRole = req.session?.user?.role || null;
    res.locals.flashMessage = null;
    if(req.session?.flashMessage){
        res.locals.flashMessage = req.session?.flashMessage || null;
        req.session.flashMessage = null;
    }
    next();
});

app.set('view engine', "ejs");
app.set('views', path.join(process.cwd(), 'views'));

// expose permission check to EJS templates: use in views as `hasPermission(currentUser, 'task:edit')`
app.locals.hasPermission = (user, permission) => hasPermission(user, permission);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Web routes
app.use("/tasks", webRoutes);
app.use("/auth", webAuthRoutes);


try {
    await sequelize.authenticate();
    console.log("DB connected");
    await sequelize.sync({alter: true});
    console.log("DB synced");
    
    app.listen(PORT, async () => {
        console.log(`Server running on : ${PORT}`);
    });
} catch (error) {
    console.error("connection failed", error);
}