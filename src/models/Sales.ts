import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { IClient } from "./Client";
import { IProduct } from "./Product";

const typeOfSale = {
   wholesale: "wholesale",
   retail: "retail",
   mercadoLibre: "mercadoLibre",
};

export type TypeOfSale = (typeof typeOfSale)[keyof typeof typeOfSale];

export interface ISales extends Document {
   client: {
      clientId: PopulatedDoc<IClient & Document>;
      name: string;
      phoneNumber: string;
      address: string;
      cuil: string;
      cp: number;
      province: string;
      city: string;
   };
   products: {
      productId: PopulatedDoc<IProduct & Document>;
      product: string;
      quantity: number;
      unitPrice: number;
   }[];
   iva: boolean;
   discount: number;
   subtotal: {
      gross: number;
      net: number;
   }
   total: {
      gross: number;
      net: number;
   }
   type: TypeOfSale;
}

const salesSchema: Schema = new Schema(
   {
      client: {
         clientId: {
            type: Schema.Types.ObjectId,
            required: true,
         },
         name: {
            type: String,
            required: true,
         },
         address: {
            type: String,
            required: true,
            trim: true,
         },
         phoneNumber: {
            type: String,
            required: true,
         },
         cuil: {
            type: String,
            required: true,
            trim: true,
         },
         cp: {
            type: Number,
            required: false,
         },
         province: {
            type: String,
            required: false,
         },
         city: {
            type: String,
            required: false,
         },
      },
      products: [
         {
            productId: {
               type: Types.ObjectId,
               ref: "Product",
            },
            product: {
               type: String,
               required: true,
            },
            quantity: {
               type: Number,
               required: true,
            },
            unitPrice: {
               type: Number,
               required: true,
            },
            cost: {
               type: Number,
               required: true
            }
         },
      ],
      subtotal: {
         gross: {
            type: Number,
            required: true,
         },
         net: {
            type: Number,
            required: true,
         } 
      },
      iva: {
         type: Boolean,
         default: false,
      },
      total: {
         gross: {
            type: Number,
            required: true,
         },
         net: {
            type: Number,
            required: true,
         } 
      },
      discount: {
         type: Number,
         required: true,
      },
      type: {
         type: String,
         enum: Object.values(typeOfSale),
         required: true,
      },
   },
   { timestamps: true }
);

const Sales = mongoose.model<ISales>("Sales", salesSchema);
export default Sales;
