const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  // ✅ Role support for both user and admin
  role: {
    type: String,
    enum: ["user", "admin"], // restrict to only these values
    default: "user",
  },
  isVerified: {
  type: Boolean,
  default: false,
},


  purchasedCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
