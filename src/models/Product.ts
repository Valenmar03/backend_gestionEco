import mongoose, {Schema, Document, ProjectionType} from "mongoose";

export type ProductType = Document & {
    productName: string;
    description: string;
    stock: number;
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
    },
})

const Product = mongoose.model<ProductType>("Product", ProductSchema)
export default Product
