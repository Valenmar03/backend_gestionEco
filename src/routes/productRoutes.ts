import { Router } from "express";
import { ProductController } from "../controller/ProductController";
import { body } from "express-validator";
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

export default router;
