import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:false,
        minlength:6,
    },
    roleId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Role",
        required:true,
    },
    status:{
        type:String,
        default:"active",
        enum:["active","inactive"],
    },},
    {
        timestamps:true,
    }
);
export const User=mongoose.model("User",userSchema);