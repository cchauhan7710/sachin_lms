const router = require("express").Router()
const User = require("../models/User")
const Course = require("../models/Course")

router.get("/stats", async (req, res) => {
  const users = await User.countDocuments()
  const courses = await Course.countDocuments()

  // count modules + lessons inside courses
  const allCourses = await Course.find()
  let modules = 0
  let lessons = 0

  allCourses.forEach(c => {
    modules += c.modules.length
    c.modules.forEach(m => { lessons += m.lessons.length })
  })

  res.json({
    success: true,
    users,
    courses,
    modules,
    lessons
  })
})

module.exports = router
