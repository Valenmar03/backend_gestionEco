import type { Request, Response } from "express"

export class ProductController {
    static getAllProducts = async (req: Request, res: Response) => {
        res.send('Get all product')

    }
}