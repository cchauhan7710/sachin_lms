import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRightIcon } from "../components/icons/IconLibrary";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 🕒 Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch User & Courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/auth?mode=login");

        const userRes = await axios.get("https://sachin-lms.onrender.com/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userRes.data.success) setUser(userRes.data.user);

        const courseRes = await axios.get(
          "https://sachin-lms.onrender.com/courses/my-learning",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (courseRes.data.success) setPurchasedCourses(courseRes.data.courses);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const formattedDate = currentTime.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400 animate-pulse text-xl font-medium">
          Loading your dashboard...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-6 md:p-10">

      {/* ---------------------- */}
      {/* HEADER SECTION */}
      {/* ---------------------- */}
      <header className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
          Welcome Back,&nbsp;
          <span className="text-orange-600 dark:text-orange-400">
            {user?.name || "Learner"} 👋
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">
          {formattedDate} —{" "}
          <span className="font-medium text-gray-900 dark:text-gray-200">
            {formattedTime}
          </span>
        </p>
      </header>

      {/* ---------------------- */}
      {/* STATS SECTION */}
      {/* ---------------------- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <StatCard
          title="Courses Enrolled"
          count={purchasedCourses.length}
          color="from-orange-500 to-yellow-400"
          emoji="📘"
        />

        <StatCard
          title="Assignments Due"
          count={purchasedCourses.length ? purchasedCourses.length - 0 : 0}
          color="from-amber-500 to-orange-400"
          emoji="📝"
        />
      </section>

      {/* ---------------------- */}
      {/* MY COURSES SECTION */}
      {/* ---------------------- */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Courses
          </h2>

          <button
            onClick={() => navigate("/my-learning")}
            className="text-orange-600 dark:text-orange-400 font-semibold hover:underline text-sm"
          >
            View All →
          </button>
        </div>

        {/* No courses purchased */}
        {purchasedCourses.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              You haven't enrolled in any courses yet.
            </p>

            <button
              onClick={() => navigate("/courses")}
              className="
                bg-gradient-to-r from-orange-500 to-orange-600
                hover:shadow-lg text-white px-6 py-3 rounded-lg font-semibold
                transition
              "
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {purchasedCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ---------------------- */
/* STAT CARD COMPONENT    */
/* ---------------------- */
const StatCard = ({ title, count, color, emoji }) => (
  <div className="
      relative bg-white dark:bg-gray-800 p-6 rounded-2xl 
      shadow-md hover:shadow-xl transition overflow-hidden border border-gray-100 dark:border-gray-700
    "
  >
    <div className={`absolute inset-0 opacity-[0.08] bg-gradient-to-r ${color}`} />

    <div className="relative z-10">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
          {title}
        </h3>
        <span className="text-3xl">{emoji}</span>
      </div>

      <p className="text-6xl font-extrabold text-gray-900 dark:text-white mt-4">
        {count}
      </p>
    </div>
  </div>
);

/* ---------------------- */
/* COURSE CARD COMPONENT  */
/* ---------------------- */
const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  return (
    <div
      className="
        bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md 
        hover:shadow-xl transition border border-gray-100 dark:border-gray-700
        flex flex-col
      "
    >
      {/* Thumbnail */}
      <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-gray-200 dark:bg-gray-700">
        <img
          src={
            course.thumbnail ||
            "https://placehold.co/600x400/FF7A00/FFFFFF?text=No+Thumbnail"
          }
          alt={course.title}
          className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
        />
      </div>

      {/* Title */}
      <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2">
        {course.title}
      </h4>

      {/* CTA */}
      <button
        onClick={() => navigate(`/course/${course._id}`)}
        className="
          mt-auto bg-gradient-to-r from-orange-500 to-orange-600
          hover:shadow-lg text-white font-semibold py-2 rounded-lg flex items-center justify-center
          transition
        "
      >
        Continue
        <ArrowRightIcon className="w-4 h-4 ml-2" />
      </button>
    </div>
  );
};
