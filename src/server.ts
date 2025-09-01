import express from "express";
import cors from "cors";
import { corsConfig } from "./config/cors";

import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import clientRoutes from "./routes/clientRoutes";
import salesRoutes from "./routes/salesRoutes";
import expensesRoutes from "./routes/expenseRoutes";

const app = express();

app.use(cors(corsConfig));
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/expenses", expensesRoutes);


app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

export default app;
