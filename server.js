import express from "express";
import dotenv from "dotenv";
import sequelize from "./services/db.js";
import authRoutes from "./routes/authRoutes.js"
dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);


try {
    await sequelize.authenticate();
    console.log("DB Connection authenticated");

    app.listen(PORT, async () => {
        console.log(`Server running on : ${PORT}`);
    });
} catch (error) {
    console.error("connection failed", error);
}