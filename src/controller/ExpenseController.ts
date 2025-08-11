// controllers/ExpenseController.ts
import { Request, Response } from "express";
import Expense from "../models/Expense";

export class ExpenseController {
   static monthRange = (month: string) => {
      // month = "YYYY-MM"
      const [y, m] = month.split("-").map(Number);
      const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
      const end = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999)); // último día del mes
      return { start, end };
   };

   static createExpense = async (req: Request, res: Response) => {
      try {
         const { description, amount, date, category, notes } = req.body;
         const expense = await Expense.create({
            description,
            amount,
            date,
            category,
            notes,
         });
         res.status(201).json({ status: "success", data: expense });
      } catch (err) {
         res.status(500).json({
            status: "error",
            message: "Error al crear el gasto",
         });
      }
   };

   static listExpenses = async (req: Request, res: Response) => {
      try {
         const { month } = req.query as { month?: string };
         let filter: any = {};
         if (month) {
            const { start, end } = ExpenseController.monthRange(month);
            filter.date = { $gte: start, $lte: end };
         }
         const expenses = await Expense.find(filter).sort({
            date: -1,
            createdAt: -1,
         });
         res.json({ status: "success", data: expenses });
      } catch (err) {
         res.status(500).json({
            status: "error",
            message: "Error al listar gastos",
         });
      }
   };

   static monthSummary = async (req: Request, res: Response) => {
      try {
         const { month } = req.query as { month: string };
         const { start, end } = ExpenseController.monthRange(month);

         const agg = await Expense.aggregate([
            { $match: { date: { $gte: start, $lte: end } } },
            {
               $group: {
                  _id: null,
                  totalGastos: { $sum: "$amount" },
                  count: { $sum: 1 },
               },
            },
         ]);

         const totalGastos = agg.length ? agg[0].totalGastos : 0;
         const count = agg.length ? agg[0].count : 0;

         res.json({ status: "success", month, totalGastos, count });
      } catch (err) {
         res.status(500).json({
            status: "error",
            message: "Error en el resumen mensual",
         });
      }
   };

   static getById = async (req: Request, res: Response) => {
      try {
         const expense = await Expense.findById(req.params.id);
         if (!expense) {
            const error = new Error("Gasto no encontrado");
            res.status(404).send(error.message);
            return;
         }
         res.json({ status: "success", data: expense });
      } catch (err) {
         res.status(500).json({
            status: "error",
            message: "Error al obtener gasto",
         });
      }
   };

   static updateExpense = async (req: Request, res: Response) => {
      try {
         const expense = await Expense.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
         );
         if (!expense) {
            const error = new Error("Gasto no encontrado");
            res.status(404).send(error.message);
            return;
         }
         res.json({ status: "success", data: expense });
      } catch (err) {
         res.status(500).json({
            status: "error",
            message: "Error al actualizar gasto",
         });
      }
   };

   static deleteExpense = async (req: Request, res: Response) => {
      try {
         const deleted = await Expense.findByIdAndDelete(req.params.id);
         if (!deleted) {
            const error = new Error("Gasto no encontrado");
            res.status(404).send(error.message);
            return;
         }
         res.json({ status: "success", message: "Gasto eliminado" });
      } catch (err) {
         res.status(500).json({
            status: "error",
            message: "Error al eliminar gasto",
         });
      }
   };
}
