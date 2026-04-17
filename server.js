import express from "express";
import dotenv from "dotenv";
import sequelize from "./services/db.js";
import authRoutes from "./routes/authRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import webRoutes from "./routes/web.js"
import path from "path";
dotenv.config();

const PORT = process.env.PORT;
const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', "ejs");
app.set('views', path.join(process.cwd(), 'views'));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Web routes
app.use("/tasks", webRoutes);


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