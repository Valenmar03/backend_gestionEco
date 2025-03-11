import { Router } from "express";
import { AuthController } from "../controller/AuthController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.post(
   "/create-account",
   body("userName")
      .notEmpty()
      .withMessage("El nombre de usuario no puede ser vacio")
      .isLength({ max: 20, min: 4 })
      .withMessage("El nombre de usuario debe tener entre 4 y 20 caracteres"),
   body("password")
      .notEmpty()
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener mas de 8 caracteres"),
   body("confirmPassword")
      .notEmpty()
      .custom((value, { req }) => {
         if (value !== req.body.password) {
            throw new Error("Las contraseñas no coinciden");
         }
         return true;
      }),
   handleInputErrors,
   AuthController.createAccount
);

export default router;
