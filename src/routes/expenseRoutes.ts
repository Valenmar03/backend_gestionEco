// routes/expenses.ts
import { Router } from "express";
import { body, param, query } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { ExpenseController } from "../controller/ExpenseController";

const router = Router();

// Crear
router.post(
  "/",
  body("description").isString().trim().isLength({ min: 2 }),
  body("amount").isFloat({ gt: 0 }),
  body("date").isISO8601(),
  body("category").optional().isString(),
  body("notes").optional().isString(),
  handleInputErrors,
  ExpenseController.createExpense
);

// Listado (opcionalmente por mes: ?month=YYYY-MM)
router.get(
  "/",
  query("month").optional().matches(/^\d{4}-\d{2}$/),
  handleInputErrors,
  ExpenseController.listExpenses
);

// Suma por mes: /summary?month=YYYY-MM
router.get(
  "/summary",
  query("month").matches(/^\d{4}-\d{2}$/),
  handleInputErrors,
  ExpenseController.monthSummary
);

// Obtener por id
router.get(
  "/:id",
  param("id").isMongoId(),
  handleInputErrors,
  ExpenseController.getById
);

// Actualizar
router.patch(
  "/:id",
  param("id").isMongoId(),
  body("description").optional().isString().trim().isLength({ min: 2 }),
  body("amount").optional().isFloat({ gt: 0 }),
  body("date").optional().isISO8601(),
  body("category").optional().isString(),
  body("notes").optional().isString(),
  handleInputErrors,
  ExpenseController.updateExpense
);

// Borrar
router.delete(
  "/:id",
  param("id").isMongoId(),
  handleInputErrors,
  ExpenseController.deleteExpense
);

export default router;
