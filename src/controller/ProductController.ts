import type { Request, Response } from "express";
import Product from "../models/Product";

export class ProductController {
   static createProduct = async (req: Request, res: Response) => {
      try {
         const {type, weight} = req.body;
   
         const productExists = await Product.findOne({ type, weight })

         if (productExists) {
            const error = new Error("Ya existe un producto con el mismo nombre y peso")
            res.status(400).send(error.message);
            return
         }

         const product = new Product(req.body)
         await product.save();
         res.send("Producto creado correctamente");
      } catch (error) {
         res.status(500).json({
            status: "error",
            message: "Hubo un error al crear el producto",
         });
      }
   };

   static getAllProducts = async (req: Request, res: Response) => {
      try {
         const products = await Product.find();
         res.send(products);
      } catch (error) {
         res.status(500).json({
            status: "error",
            message: "Hubo un error al obtener el productos",
         });
      }
   };

   static getProductById = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const product = await Product.findById(id);

         if (!product) {
            const error = new Error("Producto no encontrado");
            res.status(404).send(error.message);
            return;
         }

         res.send({ status: "success", payload: product });
      } catch (error) {
         res.status(500).json({
            status: "error",
            message: "Hubo un error al obtener el producto",
         });
      }
   };

   static updateProduct = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const { weight, type } = req.body;

         const product = await Product.findById(id);
         if (!product) {
            const error = new Error("Producto no encontrado");
            res.status(404).send(error.message);
            return;
         }

         const productExists = await Product.findOne({ type, weight })
         if (productExists && productExists._id.toString() !== id) {
            const error = new Error("Ya existe un producto con el mismo nombre y peso")
            res.status(400).send(error.message);
            return
         }

         await Product.updateOne({_id: id}, {$set: req.body})

         await product.save();
         res.send({
            status: "success",
            message: "Producto actualizado correctamente",
         });
      } catch (error) {
         res.status(500).json({
            status: "error",
            message: "Hubo un error al actualizar el producto",
         });
      }
   };

   static deleteProduct = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const product = await Product.findByIdAndDelete(id);

         if (!product) {
            const error = new Error("Producto no encontrado");
            res.status(404).send(error.message);
            return;
         }

         res.send({
            status: "success",
            message: "Producto eliminado correctamente",
         });
      } catch (error) {
         res.status(500).json({
            status: "error",
            message: "Hubo un error al eliminar el producto",
         });
      }
   };

   static modifyStock = async (req: Request, res: Response) => {
      try {
         const updates = req.body;

         if (!Array.isArray(updates) || updates.length === 0) {
            const error = new Error("Debe enviar un array de productos válido")
            res.status(400).send(error.message);
            return
         }

         const bulkOps = updates.map((product : { id: string, stock: number}) => ({
            updateOne: {
               filter: { _id: product.id },
               update: { $inc: { stock: product.stock } },
            },
         }));

         await Product.bulkWrite(bulkOps);

         res.send({
            status: "success",
            message: "Stock actualizado correctamente",
         });
      } catch (error) {
         res.status(500).json({
            status: "error",
            message: "Hubo un error al actualizar el stock",
         });
      }
   };
}
