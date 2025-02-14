import type { Request, Response } from "express";
import Product from "../models/Product";

export class ProductController {
   static createProduct = async (req: Request, res: Response) => {

        const product = new Product(req.body)

        try {
            await product.save()
            res.send('Proyecto creado correctamente')
        } catch (error) {
            
        }
   };

   static getAllProducts = async (req: Request, res: Response) => {
      res.send("Get all product");
   };
}
