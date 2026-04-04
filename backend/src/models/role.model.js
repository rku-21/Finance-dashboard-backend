import mongoose from "mongoose";

const roleSchma=new mongoose.Schema({
    name:{
        type:String,
        enum:["admin", "analyst", "viewer"],
        default:"viewer",
        required:true,
    },
},{
    timesStamps:true,

});
export const Role=mongoose.model("Role",roleSchma);
    
