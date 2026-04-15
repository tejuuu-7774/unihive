const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");
const User = require("../models/User");

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PHONE } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_PHONE) {
      throw new Error(
        "ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_PHONE are required"
      );
    }

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      existingAdmin.name = ADMIN_NAME;
      existingAdmin.phone = ADMIN_PHONE;
      existingAdmin.role = "admin";
      existingAdmin.isVerified = true;
      existingAdmin.verificationStatus = "approved";
      existingAdmin.password = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await existingAdmin.save();
      console.log("Admin updated successfully");
    } else {
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: await bcrypt.hash(ADMIN_PASSWORD, 10),
        phone: ADMIN_PHONE,
        role: "admin",
        isVerified: true,
        verificationStatus: "approved",
      });

      console.log("Admin created successfully");
    }

    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

seedAdmin();
