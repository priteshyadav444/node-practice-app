import express from "express";
import dotenv from "dotenv";
import sequelize from "./services/db.js";
dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.get('/', (req, res) => {
    res.json({ 'success': true });
})


try {
    await sequelize.authenticate();
    console.log("DB Connection authenticated");

    app.listen(PORT, async () => {
        console.log(`Server running on : ${PORT}`);
    });
} catch (error) {
    console.error("connection failed", error);
}