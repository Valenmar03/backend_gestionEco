import type { Request, Response } from "express";
import Sales from "../models/Sales";
import Client, { IClient } from "../models/Client";
import Product from "../models/Product";
import { Document, PopulatedDoc } from "mongoose";

export class SalesController {
   static createSale = async (req: Request, res: Response) => {
      try {
         const { client, products, iva, discount, type } = req.body;

         const clientExists = await Client.findById(client);
         if (!clientExists) {
            const error = new Error("Cliente no encontrado");
            res.status(404).send(error.message);
            return;
         }

         const processedProducts = [];

         for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
               const error = new Error(
                  "Error al procesar los productos. Producto no encontrado"
               );
               res.status(404).send(error.message);
               return;
            }
            processedProducts.push({
               productId: product._id,
               product: `${product.type} x ${product.weight}${product.haveWeight ? "Kg." : "mL."}`,
               unitPrice: product.price[type],
               quantity: item.quantity,
            });

            product.stock -= item.quantity;
            if (product.stock < 0) {
               const error = new Error(
                  `${product.type} x ${product.weight}${
                     product.haveWeight ? "Kg." : "mL."
                  } no tiene stock suficiente`
               );
               res.status(400).send(error.message);
               return;
            }
            await product.save();
         }

         const subtotal = processedProducts.reduce(
            (acc, item) => acc + item.unitPrice * item.quantity,
            0
         );
         const ivaAmount = iva ? subtotal * 0.21 : 0;
         const discountAmount = (discount / 100) * subtotal;
         const total = subtotal + ivaAmount - discountAmount;

         const formatedClient = {
            clientId: clientExists._id,
            name: clientExists.name
         }

         const venta = new Sales({
            client: formatedClient,
            products: processedProducts,
            type,
            subtotal,
            total,
            iva,
            discount,
         });

         await venta.save();
         res.send("Venta creada correctamente");
      } catch (error) {
         res.status(500).json({
            status: "error",
            message: error.message,
         });
      }
   };

   static getAllSales = async (req: Request, res: Response) => {
      try {
         const sales = await Sales.find()
            .populate("client")
            .populate("products.product");
         res.json(sales);
      } catch (error) {
         res.status(500).json({
            status: "error",
            message: error.message,
         });
      }
   };

   static getSaleById = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const sale = await Sales.findById(id)
            .populate("client")
            .populate("products.product");

         if (!sale) {
            const error = new Error("Venta no encontrada");
            res.status(404).send(error.message);
            return;
         }

         res.send({ status: "success", payload: sale });
      } catch (error) {
         res.status(500).json({
            status: "error",
            message: "Hubo un error al obtener la venta",
         });
      }
   };

   static updateSaleClient = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const sale = await Sales.findById(id);
         if (!sale) {
            const error = new Error("Venta no encontrada");
            res.status(404).send(error.message);
            return;
         }
         const { client } = req.body;

         const clientExists = await Client.findById(client);
         if (!clientExists) {
            const error = new Error("Cliente no encontrado");
            res.status(404).send(error.message);
            return;
         }

         const formatedClient = {
            clientId: clientExists._id as PopulatedDoc<IClient & Document>,
            name: clientExists.name
         }

         sale.client = formatedClient;

         await sale.save();
         res.send("Venta actualizada correctamente");
      } catch (error) {
         res.status(500).json({
            status: "error",
            message: "Hubo un error al obtener la venta",
         });
      }
   };

   static updateSaleProducts = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const sale = await Sales.findById(id);
         if (!sale) {
            const error = new Error("Venta no encontrada");
            res.status(404).send(error.message);
            return;
         }

         for (const item of sale.products) {
            const product = await Product.findById(item.productId);
            if (product) {
               product.stock += item.quantity;
               await product.save();
            }
         }

         const { products } = req.body;
         const processedProducts = [];

         for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product) {
               const error = new Error(
                  "Error al procesar los productos. Producto no encontrado"
               );
               res.status(404).send(error.message);
               return;
            }
            processedProducts.push({
               product: product._id,
               unitPrice: product.price[sale.type],
               quantity: item.quantity,
            });
            product.stock -= item.quantity;
            if (product.stock < 0) {
               const error = new Error(
                  `${product.type} x ${product.weight}${
                     product.haveWeight ? "Kg." : "mL."
                  } no tiene stock suficiente`
               );
               res.status(400).send(error.message);
               return;
            }
            await product.save();
         }

         const subtotal = processedProducts.reduce(
            (acc, item) => acc + item.unitPrice * item.quantity,
            0
         );
         const ivaAmount = sale.iva ? subtotal * 0.21 : 0;
         const discountAmount = (sale.discount / 100) * subtotal;
         const total = subtotal + ivaAmount - discountAmount;

         sale.products = processedProducts;
         sale.subtotal = subtotal;
         sale.total = total;

         await sale.save();
         res.send("Venta actualizada correctamente");
      } catch (error) {
         res.status(500).json({
            status: "error",
            message: error.message,
         });
      }
   };

   static updateSalePricings = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const sale = await Sales.findById(id);
         if (!sale) {
            const error = new Error("Venta no encontrada");
            res.status(404).send(error.message);
            return;
         }

         const { iva, discount, type } = req.body;

         let subtotal = type !== sale.type ? 0 : sale.subtotal;

         if (type !== sale.type) {
            const processedProducts = [];
            for (const item of sale.products) {
               const product = await Product.findById(item.productId);
               if (!product) {
                  const error = new Error(
                     "Error al procesar los productos. Producto no encontrado"
                  );
                  res.status(404).send(error.message);
                  return;
               }
               processedProducts.push({
                  product: product._id,
                  unitPrice: product.price[type],
                  quantity: item.quantity,
               });
            }
            subtotal = processedProducts.reduce(
               (acc, item) => acc + item.unitPrice * item.quantity,
               0
            );
            sale.type = type;
            sale.products = processedProducts;
         }
         const ivaAmount = iva ? subtotal * 0.21 : 0;
         const discountAmount = (discount / 100) * subtotal;
         const total = subtotal + ivaAmount - discountAmount;

         sale.subtotal = subtotal;
         sale.total = total;
         await sale.save();

         res.send("Venta actualizada correctamente");
      } catch (error) {
         res.status(500).json({
            status: "error",
            message: error.message,
         });
      }
   };

   static deleteSale = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const sale = await Sales.findByIdAndDelete(id);
         if (!sale) {
            const error = new Error("Venta no encontrada");
            res.status(404).send(error.message);
            return;
         }

         for (const item of sale.products){
            const product = await Product.findById(item.productId);
            if (product) {
               product.stock += item.quantity;
               await product.save();
            }
         }

         res.send("Venta eliminada correctamente");
      } catch (error) {
         res.status(500).json({
            status: "error",
            message: error.message,
         });
      }
   }
}
