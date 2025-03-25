import type { Request, Response } from "express";
import Sales from "../models/Sales";
import Client from "../models/Client";
import Product from "../models/Product";

export class SalesController {
    static createSale = async (req: Request, res: Response) => {
        try {
            const { clientId, products, iva, discount, type } = req.body

            const client = await Client.findById(clientId)
            if(!client) {
                const error = new Error("Cliente no encontrado")
                res.status(404).send(error.message);
                return
            }

            const processedProducts = []

            for (const item of products) {
                const product = await Product.findById(item.productId)
                if(!product) {
                    const error = new Error("Error al procesar los productos. Producto no encontrado")
                    res.status(404).send(error.message);
                    return
                }
                processedProducts.push({
                    product: product._id,
                    unitPrice: product.price[type],
                    quantity: item.quantity
                })

                product.stock -= item.quantity
                if(product.stock < 0) {
                    const error = new Error(`${product.type} x ${product.weight}${product.haveWeight ? "Kg.": "mL."} no tiene stock suficiente`)
                    res.status(400).send(error.message);
                    return
                }
                await product.save()
            }

            const subtotal = processedProducts.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)
            const ivaAmount = iva ? subtotal * 0.21 : 0
            const discountAmount = (discount/100) * subtotal
            const total = subtotal + ivaAmount - discountAmount;

            const venta = new Sales({
                client: client._id,
                products: processedProducts,
                type,
                subtotal, 
                total,
                iva, 
                discount
            })

            await venta.save()
            res.send("Venta creada correctamente")

        } catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    }

    static getAllSales = async (req: Request, res: Response) => {
        try {
            const sales = await Sales.find().populate("client").populate("products.product")
            res.json(sales)
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    }
}