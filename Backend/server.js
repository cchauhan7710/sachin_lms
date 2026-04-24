require("dotenv").config({ path: "./.env" })
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const courseRoutes = require("./routes/courses")
const uploadRoutes = require("./routes/upload")
const authRoutes = require("./routes/auth")
const adminRoutes = require("./routes/admin") 
const supportRoutes = require("./routes/support");

const app = express()

// 🔥 Allow large uploads (required for 200MB+ videos)
app.use(express.json({ limit: "1000mb" }))
app.use(express.urlencoded({ limit: "1000mb", extended: true }))

app.use(cors())

// 📌 API Routes
app.use("/auth", authRoutes)
app.use("/courses", courseRoutes)
app.use("/upload", uploadRoutes)
app.use("/support", supportRoutes)
app.use("/admin", adminRoutes)   // admin routes kept separate

// 📌 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err))

app.get("/", (req, res) => {
  res.send("Backend Running ✔️")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
