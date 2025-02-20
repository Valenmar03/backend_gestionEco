import { Router } from "express";
import { ProductController } from "../controller/ProductController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.post(
   "/",
   body("productName")
      .notEmpty()
      .withMessage("Debe agregar un nombre de producto"),
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
   body("productName")
      .notEmpty()
      .withMessage("Debe agregar un nombre de producto"),
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

export default router;
