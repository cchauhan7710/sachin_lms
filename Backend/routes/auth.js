const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const Otp = require("../models/Otp");

/* =============================
   SEND OTP
============================= */
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Clear any previous OTPs for this email to avoid confusion
    await Otp.deleteMany({ email });
    await Otp.create({ email, otp });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Verify your Email",
      text: `Your OTP is ${otp}`,
    });

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("CRITICAL OTP ERROR:", {
      message: error.message,
      stack: error.stack,
      user: process.env.MAIL_USER ? "Present" : "MISSING",
      pass: process.env.MAIL_PASS ? "Present" : "MISSING"
    });
    res.status(500).json({ 
      success: false, 
      message: "Failed to send OTP. This is usually due to missing email configuration on the server." 
    });
  }
});

/* =============================
   VERIFY OTP
============================= */
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = await Otp.findOne({ email });

    if (!record) return res.json({ success: false, message: "OTP expired" });

    if (record.otp !== otp)
      return res.json({ success: false, message: "Invalid OTP" });

    await User.findOneAndUpdate({ email }, { isVerified: true });

    res.json({ success: true, message: "Email verified" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* =============================
   REGISTER USER
============================= */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exist = await User.findOne({ email });
    if (exist)
      return res.json({ success: false, message: "Email already used" });

    const hash = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hash, isVerified: true });

    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* =============================
   USER LOGIN
============================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User not found" });

    if (!user.isVerified)
      return res.json({
        success: false,
        message: "Email not verified. Please verify via OTP.",
      });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.json({ success: false, message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* =============================
   GET CURRENT USER
============================= */
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.json({ success: false, message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id)
      .select("-password")
      .populate("purchasedCourses");

    if (!user) return res.json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("Auth /me error:", err);
    res.json({ success: false, message: "Invalid token" });
  }
});

/* =============================
   ADMIN LOGIN
============================= */
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email });
    if (!admin)
      return res.json({ success: false, message: "User not found" });

    if (admin.role !== "admin")
      return res.json({ success: false, message: "You are not an admin" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match)
      return res.json({ success: false, message: "Wrong password" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Admin login successful",
      token,
    });
  } catch (err) {
    return res.json({ success: false, message: "Server error" });
  }
});

/* =============================
   ADMIN CREATE USER
============================= */
router.post("/create", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.json({ success: false, message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      isVerified: true,
    });

    res.json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
});

/* =============================
   ADMIN UPDATE USER
============================= */
router.put("/update/:id", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let updateData = { name, email, role };

    if (password && password.trim() !== "") {
      const hashed = await bcrypt.hash(password, 10);
      updateData.password = hashed;
    }

    await User.findByIdAndUpdate(req.params.id, updateData);

    res.json({ success: true, message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Update failed" });
  }
});

/* =============================
   GET ALL USERS
============================= */
router.get("/all", async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ success: true, users });
});

/* =============================
   DELETE USER
============================= */
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
