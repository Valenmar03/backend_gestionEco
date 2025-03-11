import mongoose, { Schema, Document } from "mongoose";

export type UserType = Document&  {
    userName: string;
    password: string;
}

const UserSchema: Schema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true
    }
})

const User = mongoose.model<UserType>("Product", UserSchema)
export default User
