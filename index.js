import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import goalsRoutes from  "./routes/goals.js";
import categoryRoutes from "./routes/category.js"
import transactionsRoutes from "./routes/transactions.js";
import cron from 'node-cron';
import moment from "moment";




const morgan =require("morgan");

const app = express();
const http =require("http").createServer(app)

mongoose.connect(process.env.DATABASE)
        .then(()=> console.log("DB connected"))
        .catch((err)=> console.log("DB CONNECTION ERROR: " ,err));

import Goal from "./models/goal.js"
const resetProperty = async () => {
        try {
                await Goal.updateMany({}, { saved_this_month:0 });
                console.log('Property "saved_this_month" reset to 0 for all documents');
        } catch (err) {
                console.error('Error updating documents:', err);
}
};


cron.schedule('0 0 1 * *', async () => {
        resetProperty();
        const goals = await Goal.find();
        goals.forEach(async(goal) => {
                goal.calculateMoneyPerMonth();
                await goal.save();
        });
        console.log('Recalculation "money_per_month" complete.');
});
        
//middlewares
app.use(express.json({limit:"4mb"}))
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cors());
app.use(morgan("dev"));

//route middlewares
app.use("/api",authRoutes);
app.use("/api",goalsRoutes);
app.use('/api',transactionsRoutes)
app.use('/api',categoryRoutes)

app.listen(8001, ()=> console.log("Server running on port 8001"))