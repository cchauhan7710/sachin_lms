import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useTheme } from "../contexts/ThemeContext";

export default function CoursePlayerPage() {
  const { id } = useParams();
  const { theme } = useTheme();

  const [course, setCourse] = useState(null);
  const [moduleIndex, setModuleIndex] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [openModule, setOpenModule] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const videoRef = useRef(null);

  /* ========= FETCH COURSE ========= */
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/courses/${id}`).then((res) => {
      setCourse(res.data);

      // restore saved progress
      const saved = localStorage.getItem(`progress_${res.data._id}`);
      if (saved) {
        const p = JSON.parse(saved);
        setModuleIndex(p.moduleIndex);
        setLessonIndex(p.lessonIndex);
        setOpenModule(p.moduleIndex);
      }
    });
  }, [id]);

  const modules = course?.modules || [];
  const currentModule = modules[moduleIndex] || { lessons: [] };
  const currentLesson = currentModule.lessons?.[lessonIndex];

  /* ========= SAVE PROGRESS ========= */
  useEffect(() => {
    if (!course?._id) return;
    localStorage.setItem(
      `progress_${course._id}`,
      JSON.stringify({ moduleIndex, lessonIndex })
    );
  }, [moduleIndex, lessonIndex, course?._id]);

  /* ========= SAVE VIDEO TIME ========= */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !course?._id) return;

    const save = () => {
      localStorage.setItem(
        `time_${course._id}_${moduleIndex}_${lessonIndex}`,
        video.currentTime
      );
    };

    video.addEventListener("timeupdate", save);
    return () => video.removeEventListener("timeupdate", save);
  }, [course?._id, moduleIndex, lessonIndex]);

  /* ========= RESTORE VIDEO TIME ========= */
  useEffect(() => {
    if (!course?._id) return;

    const savedTime = localStorage.getItem(
      `time_${course._id}_${moduleIndex}_${lessonIndex}`
    );

    if (videoRef.current && savedTime) {
      videoRef.current.currentTime = Number(savedTime);
    }
  }, [course?._id, moduleIndex, lessonIndex]);

  /* ========= COMPLETED SYSTEM ========= */
  const markCompleted = () => {
    localStorage.setItem(
      `completed_${course._id}_${moduleIndex}_${lessonIndex}`,
      "true"
    );
  };

  const isCompleted = (m, l) =>
    localStorage.getItem(`completed_${course?._id}_${m}_${l}`) === "true";

  const nextLesson = () => {
    markCompleted();

    if (lessonIndex + 1 < currentModule.lessons.length) {
      setLessonIndex(lessonIndex + 1);
      return;
    }

    if (moduleIndex + 1 < modules.length) {
      setModuleIndex(moduleIndex + 1);
      setLessonIndex(0);
      setOpenModule(moduleIndex + 1);
      return;
    }

    alert("🎉 Course Completed!");
  };

  if (!course)
    return <div className="text-center p-10 text-white">Loading Course...</div>;

  if (!currentLesson)
    return <div className="text-center p-10 text-white">No Lessons Found</div>;

  /* =============================== */
  /*    UI — FULL PAGE DESIGN       */
  /* =============================== */

  return (
    <div
      className={`flex h-screen overflow-hidden transition-all ${
        theme === "dark"
          ? "bg-[#0d0d0d] text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* ===== MOBILE LESSONS BUTTON ===== */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="
          md:hidden fixed top-4 left-4 z-50
          bg-gradient-to-r from-orange-500 to-orange-600
          text-white px-4 py-2 rounded-lg shadow-lg font-semibold
        "
      >
        {sidebarOpen ? "Close" : "Lessons"}
      </button>

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-72 md:w-80 
          overflow-y-auto z-40 border-r shadow-xl transform transition-transform duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
          ${
            theme === "dark"
              ? "bg-[#111] border-gray-800"
              : "bg-white border-gray-300"
          }`}
      >
        {/* Course Title */}
        <div
          className={`p-4 border-b font-bold text-xl 
            ${
              theme === "dark"
                ? "bg-[#141414] border-gray-800"
                : "bg-gray-50 border-gray-300"
            }`}
        >
          {course.title}
        </div>

        {/* MODULES + LESSONS */}
        <div className="divide-y divide-gray-300 dark:divide-gray-800">
          {modules.map((mod, mi) => (
            <div key={mi}>
              {/* Module Title */}
              <button
                onClick={() => setOpenModule(openModule === mi ? null : mi)}
                className={`w-full text-left px-4 py-3 flex justify-between items-center font-semibold transition
                  ${
                    theme === "dark"
                      ? "hover:bg-gray-800"
                      : "hover:bg-gray-100"
                  }`}
              >
                {mod.title}
                <span className="text-sm opacity-60">
                  {openModule === mi ? "▲" : "▼"}
                </span>
              </button>

              {/* Lessons */}
              {openModule === mi && (
                <div className="pl-4 pb-3 space-y-1 mt-1">
                  {mod.lessons.map((les, li) => {
                    const active = mi === moduleIndex && li === lessonIndex;

                    return (
                      <button
                        key={li}
                        onClick={() => {
                          setModuleIndex(mi);
                          setLessonIndex(li);
                          setSidebarOpen(false);
                        }}
                        className={`
                          w-full text-left flex items-center gap-3 py-2 px-3 rounded-lg transition
                          ${
                            active
                              ? "bg-orange-600 text-white shadow-md"
                              : theme === "dark"
                              ? "text-gray-300 hover:bg-gray-800"
                              : "text-gray-800 hover:bg-gray-200"
                          }
                        `}
                      >
                        {isCompleted(mi, li) ? (
                          <span className="text-green-500">✔</span>
                        ) : (
                          <span className="text-orange-500">▶</span>
                        )}

                        <span className="truncate">{les.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 overflow-y-auto">
        {/* === VIDEO PLAYER === */}
        <div className="relative w-full bg-black shadow-xl">
          <video
            ref={videoRef}
            src={currentLesson.videoUrl}
            controls
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            autoPlay
            onEnded={nextLesson}
            className="w-full h-full max-h-[70vh] object-contain bg-black"
          />
        </div>

        {/* === LESSON HEADER === */}
        <div
          className="
            p-4 md:p-6 flex flex-col md:flex-row
            justify-between items-start md:items-center gap-4
          "
        >
          <h2 className="text-2xl font-bold tracking-wide">
            {currentLesson.title}
          </h2>

          <button
            onClick={nextLesson}
            className="
              bg-gradient-to-r from-orange-500 to-orange-600
              px-5 py-2 rounded-lg shadow-md hover:shadow-lg text-white font-semibold
              transition w-full md:w-auto
            "
          >
            Next ▶
          </button>
        </div>

        {/* === DESCRIPTION === */}
        <div className="px-4 md:px-6 pb-20 text-lg opacity-90 leading-relaxed">
          <p>{course.description}</p>
        </div>
      </main>
    </div>
  );
}
