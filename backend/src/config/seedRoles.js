import mongoose from "mongoose";
import dotenv from "dotenv";
import { Role } from "../models/role.model.js";

dotenv.config();

const roles = ["admin", "analyst", "viewer"];

const seedRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    for (let roleName of roles) {
      const exists = await Role.findOne({name:roleName});

      if (!exists) {
        await Role.create({ name: roleName });
        console.log(`Inserted role: ${roleName}`);
      } else {
        console.log(`Role already exists: ${roleName}`);
      }
    }

    console.log("Seeding done");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedRoles();