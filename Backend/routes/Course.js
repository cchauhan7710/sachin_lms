const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  description: String,
});

const ModuleSchema = new mongoose.Schema({
  title: String,
  lessons: [LessonSchema],
});

const CourseSchema = new mongoose.Schema({
  title: String,
  price: Number,
  category: String,
  level: String,
  description: String,
  thumbnail: String,
  isPublished: { type: Boolean, default: false },
  modules: [ModuleSchema],
});

module.exports = mongoose.model("Course", CourseSchema);
