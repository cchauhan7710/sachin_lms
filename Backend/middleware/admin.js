const router = require("express").Router();
const User = require("../models/User");
const Course = require("../models/Course");

// ⬅ ADD THIS
const adminAuth = require("../middlewares/adminAuth"); 

// 🔒 PROTECT THIS ROUTE 
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const users = await User.countDocuments();
    const courses = await Course.countDocuments();

    // count modules + lessons
    const allCourses = await Course.find();
    let totalModules = 0;
    let totalLessons = 0;

    allCourses.forEach((course) => {
      totalModules += course.modules.length;
      course.modules.forEach((m) => {
        totalLessons += m.lessons.length;
      });
    });

    res.json({
      success: true,
      totalUsers: users,
      totalCourses: courses,
      totalModules,
      totalLessons,
    });

  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
