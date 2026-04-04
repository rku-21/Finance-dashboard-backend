import mongoose from "mongoose";

export const connectDB=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGODB_URI,{
            serverSelectionTimeoutMS:5000,
        });
        console.log(`Database connected ${conn.connection.host}`);
        return conn;
    }catch(e){
        console.error(e);
    }
}