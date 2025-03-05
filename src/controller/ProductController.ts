import type { Request, Response } from "express";
import Product from "../models/Product";

export class ProductController {
   static createProduct = async (req: Request, res: Response) => {
      const product = new Product(req.body);

      try {
         await product.save();
         res.send("Producto creado correctamente");
      } catch (error) {
         console.log(error)
      }
   };

   static getAllProducts = async (req: Request, res: Response) => {
      try {
         const products = await Product.find();
         res.send(products);
      } catch (error) {
         console.log(error);
      }
   };

   static getProductById = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const product = await Product.findById(id);

         if (!product) {
            const error = new Error("Producto no encontrado");
            res.status(404).send({ status: "error", payload: error.message });
            return;
         }

         res.send({ status: "success", payload: product });
      } catch (error) {
         console.log(error);
      }
   };

   static updateProduct = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const product = await Product.findByIdAndUpdate(id, req.body);

         if (!product) {
            const error = new Error("Producto no encontrado");
            res.status(404).send({ status: "error", payload: error.message });
            return;
         }

         await product.save();
         res.send({
            status: "success",
            message: "Producto actualizado correctamente",
         });
      } catch (error) {
         console.log(error);
      }
   };

   static deleteProduct = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const product = await Product.findByIdAndDelete(id);

         if (!product) {
            const error = new Error("Producto no encontrado");
            res.status(404).send({ status: "error", payload: error.message });
            return;
         }

         res.send({
            status: "success",
            message: "Producto eliminado correctamente",
         });
      } catch (error) {
         console.log(error);
      }
   };

   static modifyStock = async (req: Request, res: Response) => {
      try {
         const { id } = req.params; 
         const { stock } = req.body;

        if (!stock || typeof stock !== "number") {
            res.status(400).json({ error: "El stock debe ser un número válido." });
            return
        }
        const product = await Product.findByIdAndUpdate(
            id,
            { $inc: { stock: stock } }, 
            { new: true }
        );
         if (!product) {
            const error = new Error("Producto no encontrado");
            res.status(404).send({ status: "error", payload: error.message });
            return;
         }

         res.send({
            status: "success",
            message: product,
         });
      } catch (error) {
         console.log(error);
      }
   };
}
