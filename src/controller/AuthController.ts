import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import User from "../models/User";
import { hashPassword } from "../utils/auth";

export class AuthController {
    static createAccount = async (req : Request, res : Response) => {
        try {
            const user = new User(req.body)

            hashPassword(req.body.password)
            await user.save()

            res.send({status: 'success', message: 'Cuenta Creada correctamente'})
        } catch (error) {
            res.status(500).send({status: 'error', message: error})
        }
    }
}