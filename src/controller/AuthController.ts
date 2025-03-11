import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import User from "../models/User";
import { hashPassword } from "../utils/auth";

export class AuthController {
    static createAccount = async (req : Request, res : Response) => {
        try {
            const user = new User(req.body)

            const userExists = User.findOne({userName: req.body.userName})

            if(userExists){
                const error  = new Error("Ya hay un usuario registrado con este nombre de usuario");
                res.status(409).send({message: error.message})
                return
            }

            user.password = await hashPassword(req.body.password)
            await user.save()

            res.send({status: 'success', message: 'Cuenta Creada correctamente'})
        } catch (error) {
            res.status(500).send({message: error})
        }
    }
}