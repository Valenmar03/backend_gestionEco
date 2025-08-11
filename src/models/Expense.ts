// models/Expense.ts
import mongoose, { Schema, Document} from "mongoose";

export interface IExpense extends Document {
   description: string;
   amount: number; // número positivo
   date: Date; // cuándo corresponde el gasto (ej: 2025-08-01)
   category?: string; // opcional (ej: “Logística”, “Impuestos”)
   notes?: string; // opcional
}

const ExpenseSchema: Schema = new Schema(
   {
      description: { type: String, required: true, trim: true },
      amount: { type: Number, required: true, min: 0 },
      date: { type: Date, required: true },
      category: { type: String, trim: true },
      notes: { type: String, trim: true },
   },
   { timestamps: true }
);

const Expense = mongoose.model<IExpense>("Expense", ExpenseSchema)
export default Expense
