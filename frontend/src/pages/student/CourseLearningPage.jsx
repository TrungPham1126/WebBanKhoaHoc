import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import VideoPlayer from "../../components/VideoPlayer";

const CourseLearningPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sections, setSections] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});

  // --- STATE MỚI CHO TAB ---
  const [activeTab, setActiveTab] = useState("description"); // 'description', 'exercises', 'qa'
  const [exercises, setExercises] = useState([]); // Lưu bài tập của video hiện tại
  // -------------------------

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axiosClient.get(`/courses/${id}/content`);
        setSections(res.data);
        if (res.data.length > 0 && res.data[0].lessons.length > 0) {
          setCurrentLesson(res.data[0].lessons[0]);
        }
        // Mở tất cả chương
        const defaultExpanded = {};
        res.data.forEach((sec) => (defaultExpanded[sec.id] = true));
        setExpandedSections(defaultExpanded);
      } catch (error) {
        console.error("Lỗi tải bài học:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [id]);

  // --- HIỆU ỨNG: Tải bài tập khi đổi Video hoặc đổi sang tab Bài tập ---
  useEffect(() => {
    if (currentLesson && activeTab === "exercises") {
      axiosClient
        .get(`/exercises/video/${currentLesson.id}`)
        .then((res) => setExercises(res.data))
        .catch((err) => console.log("Chưa có bài tập cho video này"));
    }
  }, [currentLesson, activeTab]);

  const handleSelectLesson = (lesson) => {
    if (lesson.type === "video") {
      setCurrentLesson(lesson);
      setActiveTab("description"); // Reset về tab mô tả khi đổi bài
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        Đang tải...
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans overflow-hidden">
      {/* HEADER */}
      <header className="h-14 bg-gray-900 text-white flex items-center px-4 justify-between flex-shrink-0 shadow-md z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/my-courses")}
            className="text-gray-400 hover:text-white transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <h1 className="font-bold text-lg truncate max-w-md">
            {currentLesson?.title}
          </h1>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* --- CỘT TRÁI --- */}
        <div className="flex-1 overflow-y-auto bg-white flex flex-col">
          {/* VIDEO PLAYER */}
          <div className="w-full bg-black aspect-video shadow-lg">
            {currentLesson && (
              <VideoPlayer
                src={`http://localhost:8080${currentLesson.videoUrl}`}
              />
            )}
          </div>

          {/* --- THANH MENU TAB --- */}
          <div className="border-b border-gray-200 px-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`py-4 text-sm font-bold border-b-2 transition ${
                  activeTab === "description"
                    ? "border-purple-600 text-purple-700"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Tổng quan
              </button>
              <button
                onClick={() => setActiveTab("exercises")}
                className={`py-4 text-sm font-bold border-b-2 transition ${
                  activeTab === "exercises"
                    ? "border-purple-600 text-purple-700"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Bài tập {exercises.length > 0 && `(${exercises.length})`}
              </button>
              <button
                onClick={() => setActiveTab("qa")}
                className={`py-4 text-sm font-bold border-b-2 transition ${
                  activeTab === "qa"
                    ? "border-purple-600 text-purple-700"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Hỏi đáp
              </button>
            </div>
          </div>

          {/* --- NỘI DUNG TAB --- */}
          <div className="p-8 max-w-4xl">
            {/* 1. TAB TỔNG QUAN */}
            {activeTab === "description" && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {currentLesson?.title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Hãy tập trung xem video và ghi chép lại những ý chính nhé. Nội
                  dung chi tiết bài học sẽ giúp bạn nắm vững kiến thức hơn.
                </p>
                <div className="flex gap-4 mt-8">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 font-medium">
                    Bài trước
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
                    Bài tiếp theo
                  </button>
                </div>
              </div>
            )}

            {/* 2. TAB BÀI TẬP */}
            {activeTab === "exercises" && (
              <div className="animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Bài tập thực hành
                </h3>
                {exercises.length > 0 ? (
                  <div className="space-y-4">
                    {exercises.map((ex, idx) => (
                      <div
                        key={ex.id}
                        className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition bg-gray-50"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900">
                            Bài {idx + 1}: {ex.title}
                          </h4>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                            {ex.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          {ex.description}
                        </p>
                        <button className="text-sm text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition">
                          Làm bài ngay
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">
                      Video này chưa có bài tập nào.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 3. TAB HỎI ĐÁP */}
            {activeTab === "qa" && (
              <div className="animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Hỏi đáp & Thảo luận
                </h3>
                <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-200">
                  <p className="text-gray-500 mb-4">
                    Tính năng đang được phát triển. Hãy quay lại sau nhé!
                  </p>
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-600 shadow-sm hover:bg-gray-50">
                    Gửi câu hỏi cho giảng viên
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- CỘT PHẢI: DANH SÁCH BÀI HỌC (Giữ nguyên) --- */}
        <div className="w-96 bg-white border-l border-gray-200 flex-shrink-0 flex flex-col overflow-hidden hidden lg:flex">
          <div className="p-4 border-b border-gray-200 font-bold text-gray-800 bg-gray-50">
            Nội dung khóa học
          </div>
          <div className="flex-1 overflow-y-auto">
            {sections.map((section, idx) => (
              <div key={section.id} className="border-b border-gray-100">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center text-left transition"
                >
                  <span className="font-bold text-gray-800 text-sm">
                    Chương {idx + 1}: {section.title}
                  </span>
                  <span
                    className={`transform transition-transform ${
                      expandedSections[section.id] ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {expandedSections[section.id] && (
                  <ul className="bg-white">
                    {section.lessons.map((lesson, lessonIdx) => {
                      const isActive = currentLesson?.id === lesson.id;
                      return (
                        <li key={lesson.id}>
                          <button
                            onClick={() => handleSelectLesson(lesson)}
                            className={`w-full px-4 py-3 flex gap-3 text-left transition hover:bg-gray-50 ${
                              isActive
                                ? "bg-purple-50 border-l-4 border-purple-600"
                                : ""
                            }`}
                          >
                            <div className="mt-0.5">
                              <input
                                type="checkbox"
                                className="w-4 h-4 accent-purple-600 cursor-pointer"
                                readOnly
                              />
                            </div>
                            <div className="flex-1">
                              <p
                                className={`text-sm ${
                                  isActive
                                    ? "font-bold text-purple-700"
                                    : "text-gray-600"
                                }`}
                              >
                                {lessonIdx + 1}. {lesson.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  {lesson.type === "video" ? "🎥" : "📝"}
                                  {lesson.duration || "05:00"}
                                </span>
                              </div>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearningPage;
