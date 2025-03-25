import mongoose, { Schema, Document, PopulatedDoc, Types} from "mongoose";
import { IClient } from "./Client";
import { IProduct } from "./Product";

export interface ISales extends Document {
    client: PopulatedDoc<IClient & Document>;
    products: {
        product: PopulatedDoc<IProduct & Document>;
        quantity: number;
    }[];
    subtotal: number;
    iva: boolean;
    total: number;
    discount: number;
}

const salesSchema: Schema = new Schema({
    client : {
        type: Types.ObjectId,
        ref: "Client"
    },
    products: [ 
        {
            product: {
                type: Types.ObjectId,
                ref: "Product"
            },
            quantity: {
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
    }
})

const Sales = mongoose.model<ISales>("Sales", salesSchema)
export default Sales