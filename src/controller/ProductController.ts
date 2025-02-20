import type { Request, Response } from "express";
import Product, { ProductType } from "../models/Product";

export class ProductController {
   static createProduct = async (req: Request, res: Response) => {
      const product = new Product(req.body);

      try {
         await product.save();
         res.send("Proyecto creado correctamente");
      } catch (error) {}
   };

   static getAllProducts = async (req: Request, res: Response) => {
      try {
         const products = await Product.find();
         res.send({ status: "success", payload: products });
      } catch (error) {
         console.log(error);
      }
   };

   static getProductById = async (req: Request, res: Response) => {
      try {
         const { id } = req.params
         const products = await Product.findById(id);
         res.send({ status: "success", payload: products });
      } catch (error) {
         console.log(error);
      }
   };
}
