import mongoose, { Schema, Document} from "mongoose";

export interface IClient extends Document {
    name: string
    address: string
    phoneNumber: string
    cuil: string
}

const ClientSchema: Schema = new Schema({
    name: {
        type: String,
        required: true, 
        trim: true
    },
    address: {
        type: String,
        required: true, 
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    cuil: {
        type: String,
        required: true, 
        trim: true
    }
})

const Client = mongoose.model<IClient>("Client", ClientSchema)
export default Client