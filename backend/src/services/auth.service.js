import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

export const registerUser = async (data) => {
    const { email, password } = data;

    const user = await User.findOne({ email }).populate("roleId");

    if (!user) {
        const error = new Error("account not found, contact admin");
        error.statusCode = 404;
        throw error;
    }

    if (user.status !== "active") {
        const error = new Error("account is inactive");
        error.statusCode = 403;
        throw error;
    }

    if (!user.password) {
        user.password = await bcrypt.hash(password, 10);
        await user.save();
        return await User.findById(user._id).populate("roleId").select("-password");
    }

    const error = new Error("use login for existing account");
    error.statusCode = 400;
    throw error;
}
export const loginUser=async(data)=>{
    const {email,password}=data;

    const user=await User.findOne({email}).populate("roleId");
    if(!user){
        const error = new Error("invalid credentials");
        error.statusCode = 401;
        throw error;
    }

    if (user.status !== "active") {
        const error = new Error("account is inactive");
        error.statusCode = 403;
        throw error;
    }

    if (!user.password) {
        const error = new Error("password not set register first");
        error.statusCode = 400;
        throw error;
    }

    const isMatch= await bcrypt.compare(password,user.password);
    if(!isMatch){
        const error = new Error("invalid credentials");
        error.statusCode = 401;
        throw error;
    }
    return await User.findById(user._id).populate("roleId").select("-password");
}
