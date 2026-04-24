const router = require("express").Router();
const Course = require("../models/Course");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Verify Token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

/* ============================
   CREATE COURSE (ADMIN)
============================ */
router.post("/create", async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.json({ success: true, course });
  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ success: false, err });
  }
});

/* ============================
   GET ALL COURSES
============================ */
router.get("/all", async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

/* ============================
   PUBLISH / UNPUBLISH COURSE
============================ */
router.patch("/:id/publish", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });

    course.isPublished = !course.isPublished;
    await course.save();

    res.json({ success: true, isPublished: course.isPublished });
  } catch (err) {
    console.error("Publish toggle error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/* ============================
   GET USER PURCHASED COURSES
============================ */
router.get("/my-learning", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("purchasedCourses");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, courses: user.purchasedCourses });
  } catch (err) {
    console.error("Error fetching my-learning:", err);
    res.status(500).json({ success: false });
  }
});

/* ============================
   GET SINGLE COURSE
============================ */
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.json(course);
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
});

/* ============================
   ADD MODULE
============================ */
router.post("/:id/module", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.json({ success: false, message: "Course not found" });

    course.modules.push(req.body);
    await course.save();

    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
});

/* ============================
   ADD LESSON
============================ */
router.post("/:id/module/:mIndex/lesson", async (req, res) => {
  try {
    const { mIndex } = req.params;
    const { title, videoUrl, description } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) return res.json({ success: false, message: "Course not found" });

    course.modules[mIndex].lessons.push({ title, videoUrl, description });
    await course.save();

    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
});

/* ============================
   DELETE MODULE
============================ */
router.delete("/:id/module/:mIndex", async (req, res) => {
  try {
    const { mIndex } = req.params;
    const course = await Course.findById(req.params.id);

    if (!course) return res.json({ success: false });

    course.modules.splice(mIndex, 1);
    await course.save();

    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ============================
   DELETE LESSON
============================ */
router.delete("/:id/module/:mIndex/lesson/:lIndex", async (req, res) => {
  try {
    const { mIndex, lIndex } = req.params;
    const course = await Course.findById(req.params.id);

    if (!course) return res.json({ success: false });

    course.modules[mIndex].lessons.splice(lIndex, 1);
    await course.save();

    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ============================
   DELETE COURSE
============================ */
router.delete("/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ============================
   PURCHASE COURSE
============================ */
router.post("/purchase/:courseId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const course = await Course.findById(req.params.courseId);

    if (!user || !course) return res.json({ success: false });

    if (user.purchasedCourses.includes(course._id)) {
      return res.json({ success: false, message: "Already purchased" });
    }

    user.purchasedCourses.push(course._id);
    await user.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
