import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const authenticate = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const bearer = req.headers.authorization;
   if (!bearer) {
      const error = new Error("No autorizado");
      res.status(401).send(error.message);
      return;
   }

   const token = bearer.split(" ")[1];

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (typeof decoded === "object" && decoded.id) {
         const user = await User.findById(decoded.id).select("userName")
         if(!user){
            const error = new Error("No autorizado");
            res.status(404).send(error.message);
            return;
         }
         req.user = user
         console.log(req.user)
      }
   } catch (error) {
      res.status(500).send(error.message);
   }

   next();
};
