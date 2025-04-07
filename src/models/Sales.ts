import mongoose, { Schema, Document, PopulatedDoc, Types} from "mongoose";
import { IClient } from "./Client";
import { IProduct } from "./Product";

const typeOfSale = {
    wholesalePrice: "wholesalePrice",
    retailPrice: "retailPrice",
    mercadoLibrePrice: "mercadoLibrePrice"
}

export type TypeOfSale = typeof typeOfSale[keyof typeof typeOfSale]

export interface ISales extends Document {
    client: PopulatedDoc<IClient & Document>;
    products: {
        productId: PopulatedDoc<IProduct & Document>;
        product: string
        quantity: number;
        unitPrice: number;
    }[];
    iva: boolean;
    discount: number
    subtotal: number;
    total: number;
    type: TypeOfSale
}

const salesSchema: Schema = new Schema({
    client : {
        type: Types.ObjectId,
        ref: "Client"
    },
    products: [ 
        {
            productId: {
                type: Types.ObjectId,
                ref: "Product"
            },
            product: {
                type: String,
                required: true  
            },
            quantity: {
                type: Number,
                required: true
            },
            unitPrice: {
                type: Number,
                required: true
            }
        }
    ],
    subtotal: {
        type: Number,
        required: true
    },
    iva: {
        type: Boolean,
        default: false
    },
    total: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(typeOfSale),
        required: true
    }
}, {timestamps: true})

const Sales = mongoose.model<ISales>("Sales", salesSchema)
export default Sales