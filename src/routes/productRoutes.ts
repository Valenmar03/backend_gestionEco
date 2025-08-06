import { Router } from "express";
import { ProductController } from "../controller/ProductController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate)

router.post(
   "/",
   body("type")
      .notEmpty()
      .withMessage("Debe agregar un nombre de producto"),
   body("haveWeight")
      .notEmpty()
      .withMessage("Debe agregar si el producto tiene peso o volumen "),
   body("weight")
      .notEmpty()
      .isNumeric()
      .withMessage("Debe agregar un pesaje del producto"),
   body("cost")
      .notEmpty()
      .isNumeric()
      .withMessage("Debe agregar un costo del producto"),
   body("revenuePercentage.wholesale")
      .notEmpty()
      .isNumeric()
      .withMessage("Debe agregar un porcentaje de ganancia mayorista"),
   body("revenuePercentage.retail")
      .notEmpty()
      .isNumeric()
      .withMessage("Debe agregar un porcentaje de ganancia minorista"),
   body("revenuePercentage.mercadoLibre")
      .notEmpty()
      .isNumeric()
      .withMessage("Debe agregar un porcentaje de ganancia de Mercado Libre"),
   handleInputErrors,
   ProductController.createProduct
);
router.get("/", ProductController.getAllProducts);

router.get("/:id",
   param("id")
      .isMongoId()
      .withMessage("El ID del producto no es válido"),
   handleInputErrors,
   ProductController.getProductById
);
router.put("/:id",
   param("id")
      .isMongoId()
      .withMessage("El ID del producto no es válido"),
   body("type")
      .notEmpty()
      .withMessage("Debe agregar un nombre de producto"),
   body("haveWeight")
      .notEmpty()
      .withMessage("Debe agregar si el producto tiene peso o volumen "),
   body("weight")
      .notEmpty()
      .isNumeric()
      .withMessage("Debe agregar un pesaje del producto"),
   body("cost")
      .notEmpty()
      .isNumeric()
      .withMessage("Debe agregar un costo del producto"),
   body("revenuePercentage.wholesale")
      .notEmpty()
      .isNumeric()
      .withMessage("Debe agregar un precio mayorista"),
   body("revenuePercentage.retail")
      .notEmpty()
      .isNumeric()
      .withMessage("Debe agregar un precio minorista"),
   body("revenuePercentage.mercadoLibre")
      .notEmpty()
      .isNumeric()
      .withMessage("Debe agregar un precio de Mercado Libre"),
   handleInputErrors,
   ProductController.updateProduct
);

router.delete("/:id",
   param("id")
      .isMongoId()
      .withMessage("El ID del producto no es válido"),
   handleInputErrors,
   ProductController.deleteProduct
);

router.patch("/addStock",
   body()
      .isArray()
      .withMessage("El cuerpo de la solicitud debe ser un array"),
   body("*.id")
      .isString()
      .notEmpty()
      .withMessage("Cada objeto debe tener un 'id' válido"),
   body("*.stock")
      .isNumeric()
      .withMessage("El stock debe ser un numero"),
   handleInputErrors,
   ProductController.modifyStock 
)

export default router;
