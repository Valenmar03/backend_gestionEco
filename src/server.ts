import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsConfig } from "./config/cors";
import { connectDB } from "./config/db";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import clientRoutes from "./routes/clientRoutes"
import salesRoutes from "./routes/salesRoutes"
import expensesRoutes from "./routes/expenseRoutes"

dotenv.config()

connectDB()

const app = express();

app.use(cors(corsConfig))

app.use(express.json())

//Routes
    //Products
app.use('/api/products', productRoutes)
    //Auth
app.use('/api/auth', authRoutes)
    //Client
app.use("/api/client", clientRoutes)
    //Sales
app.use("/api/sales", salesRoutes)
    //Expenses
app.use("/api/expenses", expensesRoutes)

export default app