import mongoose from "mongoose";
import colors from "colors";
import { exit } from 'node:process';

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.DATABASE_URL)
        const url = `${connection.connection.host}:${connection.connection.port}`
        console.log(colors.magenta(`MongoDB Connected to: ${url}`))
    } catch (error) {
        console.log(colors.bgRed(error.message))
        exit(1)
    }
}