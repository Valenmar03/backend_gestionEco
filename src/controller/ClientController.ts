import type { Request, Response } from "express";
import Client from "../models/Client";

export class ClientController {
   static createClient = async (req: Request, res: Response) => {
      try {
         const { cuil } = req.body;

         const clientExists = await Client.findOne({ cuil });
         if (clientExists) {
            const error = new Error("Ya existe un cliente con el mismo cuil");
            res.status(400).send(error.message);
            return;
         }

         const client = new Client(req.body);
         await client.save();
         res.send("Cliente creado correctamente");
      } catch (error) {
         res.status(500).json({
            status: "error",
            message: "Hubo un error al crear el cliente",
         });
      }
   };

   static getAllClients = async (req: Request, res: Response) => {
      try {
         const clients = await Client.find();
         res.send(clients);
      } catch (error) {
         res.status(500).json({
            status: "error",
            message: "Hubo un error al obtener los clientes",
         });
      }
   };

   static getclientById = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const client = await Client.findById(id);

         if (!client) {
            const error = new Error("Cliente no encontrado");
            res.status(404).send(error.message);
            return;
         }

         res.send({ status: "success", payload: client });
      } catch (error) {
         res.status(500).json({
            status: "error",
            message: "Hubo un error al obtener el cliente",
         });
      }
   };

   
}
