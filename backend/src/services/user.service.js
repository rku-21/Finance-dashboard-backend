import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";

export const getAllUsers = async () => {
    const users= await User.find({}).populate("roleId").select("-password").sort({ createdAt: -1 });
    return users;

}

export const createUser = async (data) => {
    const { name, email, role } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error("email already exists");
        error.statusCode = 409;
        throw error;
    }

    const roleDoc = await Role.findOne({
        name: { $regex: `^${role.trim()}$`, $options: "i" },
    });

    if (!roleDoc) {
        const error = new Error("invalid role provided");
        error.statusCode = 400;
        throw error;
    }

    const user = await User.create({
        name,
        email,
        roleId: roleDoc._id,
        status: "active",
    });

    return await User.findById(user._id).populate("roleId").select("-password");
}

export const getUserById = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        const error = new Error("invalid user id");
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findById(userId).populate("roleId").select("-password");
    if (!user) {
        const error = new Error("user not found");
        error.statusCode = 404;
        throw error;
    }
    return user;
}

export const updateUserById = async (userId, data, currentUserId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        const error = new Error("invalid user id");
        error.statusCode = 400;
        throw error;
    }

    if (String(currentUserId) === String(userId) && data.status && data.status !== "active") {
        const error = new Error("admin cannot mark itself inactive");
        error.statusCode = 400;
        throw error;
    }

    if (data.role) {
        const roleDoc = await Role.findOne({
            name: { $regex: `^${data.role.trim()}$`, $options: "i" },
        });

        if (!roleDoc) {
            const error = new Error("invalid role for updating");
            error.statusCode = 400;
            throw error;
        }

        data.roleId = roleDoc._id;
        delete data.role;
    }
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
        new: true,
        runValidators: true,
    }).populate("roleId").select("-password");

    if (!updatedUser) {
        const error = new Error("user not found");
        error.statusCode = 404;
        throw error;
    }
    return updatedUser;
}

export const updateUserStatusById = async (userId, status, currentUserId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        const error = new Error("invalid User id");
        error.statusCode = 400;
        throw error;
    }

    if (status !== "active" && status !== "inactive") {
        const error = new Error("status must be active or inactive");
        error.statusCode = 400;
        throw error;
    }

    if (String(currentUserId) === String(userId) && status !== "active") {
        const error = new Error("admin cannot mark self inactive");
        error.statusCode = 400;
        throw error;
    }

    const updatedUser = await User.findByIdAndUpdate(userId,{ status },{ new: true, runValidators: true }
    ).populate("roleId").select("-password");

    if (!updatedUser) {
        const error = new Error("user not found");
        error.statusCode = 404;
        throw error;
    }

    return updatedUser;
}

export const deleteUserById = async (userId, currentUserId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        const error = new Error("invalid user id");
        error.statusCode = 400;
        throw error;
    }

    if (String(currentUserId) === String(userId)) {
        const error = new Error("admin cannot delete itself");
        error.statusCode = 400;
        throw error;
    }

    const deletedUser = await User.findByIdAndDelete(userId).populate("roleId").select("-password");
    if (!deletedUser) {
        const error = new Error("user not found");
        error.statusCode = 404;
        throw error;
    }
    return deletedUser;
}
