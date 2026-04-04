import mongoose from "mongoose";
import dotenv from "dotenv"
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";
dotenv.config();
const admins=[
    {
        name:"Rahul",
        email:"test1@gmail.com",
        password:"test123",
    },
    {
        name:"Rohit",
        email:"test2@gmail.com",
        password:"test124",
    }
]
export const createAdmin=async()=>{
    try{
      await mongoose.connect(process.env.MONGODB_URI);
            const adminRole = await Role.findOne({ name: "admin" });
            if (!adminRole) {
                throw new Error("admin role not found ,Run seedRoles first");
            }

      for(let admin of admins){
        const exists=await User.findOne({email:admin.email});
        if(!exists){
            const hashedPassword = await bcrypt.hash(admin.password, 10);
            await User.create({
                name: admin.name,
                email: admin.email,
                password: hashedPassword,
                roleId: adminRole._id,
                status: "active",
            });
            console.log(`Inserted admin ${admin.email}`);
            } else {
             console.log(`Admin already exists ${admin.email}`);
        }
      }
      console.log("All admins seeded");
      process.exit();

    }catch(error){
        console.error(error);
        process.exit(1);
    }
}

createAdmin();

