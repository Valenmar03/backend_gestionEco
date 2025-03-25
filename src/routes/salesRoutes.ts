import { Router } from "express";
import { body } from "express-validator";
import { SalesController } from "../controller/SalesController";
import { handleInputErrors } from "../middleware/validation";

const router = Router()

router.post("/", 
    body("clientId")
        .isMongoId().withMessage("Id no válido"),
    body("products")
        .isArray()
        .withMessage("El cuerpo de la solicitud debe ser un array"),
    body("products.*.productId")
        .isMongoId().withMessage("Id no válido"),
    body("products.*.quantity")
        .isNumeric().withMessage("La cantidad debe ser un número"),
    body("iva")
        .isBoolean().withMessage("El IVA debe ser un booleano"),
    body("discount")
        .isNumeric().withMessage("El descuento debe ser un número"),
    body("type")
        .notEmpty().withMessage("Debe agregar un tipo de venta")
        .isIn(["wholesalePrice", "retailPrice", "MercadoLibrePrice"]).withMessage("Tipo de venta no válido"),
    handleInputErrors,
    SalesController.createSale
)

router.get("/", SalesController.getAllSales)


export default router