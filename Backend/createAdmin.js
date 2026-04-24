require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // Adjust path if needed

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@example.com";
    const password = "StrongPass123!";
    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("⚠️ Admin already exists with this email:", email);
      process.exit(0);
    }

    const admin = new User({
      name: "Admin",
      email,
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();
    console.log("✅ Admin created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error creating admin:", err);
  }
}

createAdmin();
