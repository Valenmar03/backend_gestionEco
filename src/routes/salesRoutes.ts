import { Router } from "express";
import { body, param } from "express-validator";
import { SalesController } from "../controller/SalesController";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.post(
   "/",
   body("client").isMongoId().withMessage("Id no válido"),
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
      .isIn(["wholesalePrice", "retailPrice", "mercadoLibrePrice"])
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
      .isIn(["wholesalePrice", "retailPrice", "mercadoLibrePrice"])
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
