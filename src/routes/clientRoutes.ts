import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { ClientController } from "../controller/ClientController";

const router = Router();

router.use(authenticate);

router.post(
   "/",
   body("name")
      .notEmpty()
      .isLength({ min: 4, max: 20 })
      .withMessage("El nombre debe tener mas de 4 caracteres y menos de 20"),
   body("address").notEmpty().withMessage("La direccion no puede estar vacía"),
   body("phoneNumber")
      .notEmpty()
      .withMessage("Debe ingresar un numero de telefono"),
   body("cuil")
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage("El cuil no deber venir vacio y debe tener al menos 10 caracteres"),
   handleInputErrors,
   ClientController.createClient
);

router.get("/",
   ClientController.getAllClients
)

router.get("/:id",
   param("id")
      .isMongoId()
      .withMessage("El ID del producto no es válido"),
   handleInputErrors,
   ClientController.getclientById
)

router.put("/:id",
   body("name")
      .notEmpty()
      .isLength({ min: 4, max: 20 })
      .withMessage("El nombre debe tener mas de 4 caracteres y menos de 20"),
   body("address").notEmpty().withMessage("La direccion no puede estar vacía"),
   body("phoneNumber")
      .notEmpty()
      .withMessage("Debe ingresar un numero de telefono"),
   body("cuil")
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage("El cuil no deber venir vacio y debe tener al menos 10 caracteres"),
   handleInputErrors,
   ClientController.updateClient
)

export default router;