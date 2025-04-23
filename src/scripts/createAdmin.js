import { config } from "dotenv";
import {getLogger} from "../utils/logger.js";

const logger = getLogger();

config();

import connectDB from "../config/mongodb.js";
import { userModel } from "../models/user.model.js";
import { hashPassword } from "../utils/password.utils.js";

async function createAdmin() {
  try {
    await connectDB();
    const email = "admin@gmail.com";
    const password = "admin123";

    const existingAdmin = await userModel.findOne({ email });
    if (existingAdmin) {
      logger.info("El usuario admin ya existe.");
      process.exit(0);
    }

    const hashedPassword = await hashPassword(password);
    const adminData = {
      first_name: "Admin",
      last_name: "User",
      age: 35,
      email,
      password: hashedPassword,
      role: "admin",
    };

    const admin = await userModel.create(adminData);
    logger.info("Usuario admin creado con éxito:", admin);
    process.exit(0);
  } catch (error) {
    logger.error("Error al crear el usuario admin:", error);
    process.exit(1);
  }
}

createAdmin();
