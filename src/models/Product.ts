import mongoose, {Schema, Document} from "mongoose";

export type ProductType = Document & {
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

const Product = mongoose.model<ProductType>("Product", ProductSchema)
export default Product
