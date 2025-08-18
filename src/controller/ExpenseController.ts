// controllers/ExpenseController.ts
import { Request, Response } from "express";
import Expense from "../models/Expense";

export class ExpenseController {
   // Helper: devuelve el primer y último día del mes en "YYYY-MM-DD"
   static monthRange(input: string) {
      const now = new Date();
      let year: number, month: number;

      if (/^\d{4}-\d{2}$/.test(input)) {
         const [y, m] = input.split("-").map(Number);
         year = y;
         month = m; // 1..12
      } else {
         year = now.getFullYear();
         month = Number(input); // "8" -> 8
      }

      const mm = String(month).padStart(2, "0");
      const start = `${year}-${mm}-01`;

      // último día del mes usando UTC para evitar desfasajes
      const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
      const end = `${year}-${mm}-${String(lastDay).padStart(2, "0")}`;

      return { start, end };
   }

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
         const filter: Record<string, any> = {};

         if (month) {
            const { start, end } = ExpenseController.monthRange(month);
            // date es STRING "YYYY-MM-DD" -> filtro lexicográfico
            filter.date = { $gte: start, $lte: end };
         }

         const expenses = await Expense.find(filter).sort({
            date: -1, // ordena por fecha (string YYYY-MM-DD funciona OK)
            createdAt: -1, // desempate
         });

         res.json(expenses);
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
