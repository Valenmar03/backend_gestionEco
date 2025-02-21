import mongoose, {Schema, Document} from "mongoose";

export type ProductType = Document & {
    productName: string;
    description: string;
    stock: number;
    cost: number;
    price: {
        wholesalePrice: number;
        retailPrice: number;
    }
}


const ProductSchema: Schema = new Schema({
    productName: {
        type: String, 
        required: true,
        trim: true,
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

const Product = mongoose.model<ProductType>("Product", ProductSchema)
export default Product
