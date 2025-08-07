import { Router } from "express";
import { body, param } from "express-validator";
import { SalesController } from "../controller/SalesController";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.post(
   "/",
   body("client._id").isMongoId().withMessage("Id no válido"),
   body("products")
      .isArray()
      .withMessage("El cuerpo de la solicitud debe ser un array"),
   body("products.*.product").isMongoId().withMessage("Id no válido"),
   body("products.*.quantity")
      .isNumeric()
      .withMessage("La cantidad debe ser un número"),
   body("iva").isBoolean().withMessage("El IVA debe ser un booleano"),
   body("discount").isNumeric().withMessage("El descuento debe ser un número"),
   body("type")
      .notEmpty()
      .withMessage("Debe agregar un tipo de venta")
      .isIn(["wholesale", "retail", "mercadoLibre"])
      .withMessage("Tipo de venta no válido"),
   handleInputErrors,
   SalesController.createSale
);

router.get("/", SalesController.getAllSales);

router.get(
   "/:id",
   param("id").isMongoId().withMessage("El ID de la venta no es válido"),
   handleInputErrors,
   SalesController.getSaleById
);

router.post(
   "/by-month",
   body("month")
      .isInt({ min: 1, max: 12 })
      .withMessage("El mes debe estar entre 1 y 12"),
   body("year")
      .isInt({ min: 2000 }) // Podés ajustar el mínimo si querés
      .withMessage("Debe ingresar un año válido"),
   handleInputErrors,
   SalesController.getSalesByMonth
);

router.patch(
   "/:id/client",
   param("id").isMongoId().withMessage("El ID de la venta no es válido"),
   body("clientId").isMongoId().withMessage("Id de cliente no válido"),
   handleInputErrors,
   SalesController.updateSaleClient
);

router.patch(
   "/:id/products",
   param("id").isMongoId().withMessage("El ID de la venta no es válido"),
   body("products")
      .isArray({ min: 1 })
      .withMessage("Debe enviar al menos un producto"),
   body("products.*.productId").isMongoId().withMessage("Id no válido"),
   body("products.*.quantity")
      .isNumeric()
      .withMessage("La cantidad debe ser un número"),
   handleInputErrors,
   SalesController.updateSaleProducts
);
router.patch(
   "/:id/pricing",
   param("id").isMongoId().withMessage("El ID de la venta no es válido"),
   body("iva").isBoolean().withMessage("El IVA debe ser un booleano"),
   body("discount").isNumeric().withMessage("El descuento debe ser un número"),
   body("type")
      .notEmpty()
      .withMessage("Debe agregar un tipo de venta")
      .isIn(["wholesale", "retail", "mercadoLibre"])
      .withMessage("Tipo de venta no válido"),
   handleInputErrors,
   SalesController.updateSalePricings
);

router.delete("/:id",
   param("id").isMongoId().withMessage("El ID de la venta no es válido"),
   handleInputErrors,
   SalesController.deleteSale
)

export default router;
