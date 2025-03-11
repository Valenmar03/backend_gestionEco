import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";

export class AuthController {
    static createAccount = async (req : Request, res : Response) => {
        try {
            const user = new User(req.body)

            const userExists = User.findOne({userName: req.body.userName})

            if(userExists){
                const error  = new Error("Ya hay un usuario registrado con este nombre de usuario");
                res.status(409).send(error.message)
                return
            }

            user.password = await hashPassword(req.body.password)
            await user.save()

            res.send({status: 'success', message: 'Cuenta Creada correctamente'})
        } catch (error) {
            res.status(500).send({message: error})
        }
    }

    static login = async (req : Request, res : Response) => {
        try {
            const { userName, password } = req.body
            const user = await User.findOne({userName})
            if(!user){
                const error  = new Error("Usuario no encontrado");
                res.status(404).send(error.message)
                return
            }

            const isPasswordCorrect = await checkPassword(password, user.password)
            if(!isPasswordCorrect){
                const error  = new Error("Usuario y/o contraseña incorrectos");
                res.status(401).send(error.message)
                return
            }

            res.send({status: 'success', message: 'Usuario Logueado correctamente'})
        } catch (error) {
            res.status(500).send({message: error})
        }
    }
}