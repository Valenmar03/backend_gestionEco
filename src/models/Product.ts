import mongoose, {Schema, Document} from "mongoose";

export interface IProduct extends Document {
    type: string;
    haveWeight: boolean;
    weight: number;
    stock: number;
    cost: number;
    price: {
        wholesalePrice: number;
        retailPrice: number;
    }
}


const ProductSchema: Schema = new Schema({
    type: {
        type: String, 
        required: true,
        trim: true,
    },
    haveWeight: {
        type: Boolean, 
        required: true,
    },
    weight: {
        type: Number, 
        required: true,
    },
    stock: {
        type: Number, 
        required: true,
        default: 0,
    },
    cost: {
        type: Number, 
        required: true,
    },
    price: {
        wholesalePrice: {
            type: Number,
            required: true
        },
        retailPrice: {
            type: Number,
            required: true
        }
    }
})

const Product = mongoose.model<IProduct>("Product", ProductSchema)
export default Product
