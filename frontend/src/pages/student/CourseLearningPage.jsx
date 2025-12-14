import React, { useEffect, useState, useMemo } from "react"; // Thêm useMemo
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import VideoPlayer from "../../components/VideoPlayer";

// Mock data cho đánh giá
const MOCK_REVIEWS = [
  {
    id: 1,
    user: "Nguyễn Văn A",
    rating: 5,
    comment: "Khóa học rất tuyệt vời, dễ hiểu!",
    date: "2 ngày trước",
  },
  {
    id: 2,
    user: "Trần Thị B",
    rating: 4,
    comment: "Giảng viên nhiệt tình, nhưng âm thanh hơi nhỏ.",
    date: "1 tuần trước",
  },
];

const CourseLearningPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- STATE ---
  const [sections, setSections] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});

  // Tabs
  const [activeTab, setActiveTab] = useState("description");
  const [exercises, setExercises] = useState([]);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);

  // --- 🔥 TÍNH TOÁN TIẾN ĐỘ (LOGIC MỚI) ---
  const { totalLessons, completedLessons, progressPercent } = useMemo(() => {
    let total = 0;
    let completed = 0;

    sections.forEach((section) => {
      if (section.lessons) {
        total += section.lessons.length;
        // Kiểm tra lesson.completed (được trả về từ Backend)
        completed += section.lessons.filter((l) => l.completed).length;
      }
    });

    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return {
      totalLessons: total,
      completedLessons: completed,
      progressPercent: percent,
    };
  }, [sections]); // Tự động tính lại khi sections thay đổi (vd: khi xem xong video)

  // --- EFFECTS ---
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axiosClient.get(`/courses/${id}/content`);
        setSections(res.data);

        // Mặc định chọn bài đầu tiên chưa học hoặc bài 1
        if (res.data.length > 0) {
          // Logic tìm bài học đầu tiên
          const firstLesson = res.data[0].lessons[0];
          if (firstLesson) setCurrentLesson(firstLesson);
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

  // Tải bài tập khi đổi bài học
  useEffect(() => {
    if (currentLesson) {
      axiosClient
        .get(`/exercises/video/${currentLesson.id}`)
        .then((res) => setExercises(res.data))
        .catch(() => setExercises([]));
    }
  }, [currentLesson]);

  // --- HANDLERS ---
  const handleSelectLesson = (lesson) => {
    if (lesson.type === "video") {
      setCurrentLesson(lesson);
      setActiveTab("description");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // XỬ LÝ KHI XEM HẾT VIDEO
  const handleVideoEnded = async () => {
    if (!currentLesson) return;
    try {
      // 1. Gọi API Backend để lưu tiến độ
      await axiosClient.post(`/courses/progress/video/${currentLesson.id}`);

      // 2. Cập nhật State Local để hiện tick xanh VÀ tăng thanh tiến độ ngay lập tức
      setSections((prevSections) =>
        prevSections.map((sec) => ({
          ...sec,
          lessons: sec.lessons.map((lesson) => {
            if (lesson.id === currentLesson.id) {
              return { ...lesson, completed: true }; // Đánh dấu đã học
            }
            return lesson;
          }),
        }))
      );

      console.log(">>> Đã hoàn thành bài học: " + currentLesson.title);
    } catch (error) {
      console.error("Lỗi lưu tiến độ:", error);
    }
  };

  const handleViewExercisesDirectly = (e, lesson) => {
    e.stopPropagation();
    setCurrentLesson(lesson);
    setActiveTab("exercises");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm font-medium">
            Đang tải khóa học...
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans overflow-hidden">
      {/* --- HEADER --- */}
      <header className="h-16 bg-gray-900 text-white flex items-center justify-between px-6 shadow-md z-30 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/my-courses")}
            className="p-2 rounded-full hover:bg-gray-700 transition text-gray-400 hover:text-white"
            title="Quay lại khóa học của tôi"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <div className="h-8 w-[1px] bg-gray-700 mx-2"></div>
          <h1 className="font-bold text-lg truncate max-w-xl text-gray-100 tracking-wide">
            {currentLesson?.title || "Đang học"}
          </h1>
        </div>

        {/* 🔥 THANH TIẾN ĐỘ (ĐÃ SỬA DỮ LIỆU THẬT) */}
        <div className="hidden md:flex items-center gap-3">
          <div className="text-xs font-medium text-gray-400">
            Tiến độ: {progressPercent}%
          </div>
          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }} // Dynamic width
            ></div>
          </div>
        </div>
      </header>

      {/* --- BODY --- */}
      <div className="flex flex-1 overflow-hidden">
        {/* --- MAIN CONTENT (TRÁI) --- */}
        <div className="flex-1 overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300">
          <div className="w-full bg-black shadow-2xl">
            <div className="aspect-video w-full max-w-[1200px] mx-auto bg-black">
              {currentLesson && (
                <VideoPlayer
                  src={`http://localhost:8080${currentLesson.videoUrl}`}
                  onEnded={handleVideoEnded}
                />
              )}
            </div>
          </div>

          {/* CONTENT TABS */}
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="flex border-b border-gray-200 mb-6 sticky top-[0px] bg-gray-50 z-10 pt-2">
              {[
                { id: "description", label: "Tổng quan" },
                { id: "exercises", label: `Bài tập (${exercises.length})` },
                { id: "qa", label: "Hỏi đáp" },
                { id: "reviews", label: "Đánh giá" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-bold border-b-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? "border-indigo-600 text-indigo-700"
                      : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="min-h-[300px]">
              {/* 1. TỔNG QUAN */}
              {activeTab === "description" && (
                <div className="animate-fadeIn">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {currentLesson?.title}
                  </h2>
                  <div className="prose max-w-none text-gray-600">
                    <p>
                      Chào mừng bạn đến với bài học này. Hãy tập trung theo dõi
                      video và ghi chú lại những kiến thức quan trọng.
                    </p>
                  </div>
                </div>
              )}

              {/* 2. BÀI TẬP */}
              {activeTab === "exercises" && (
                <div className="animate-fadeIn space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      Danh sách bài tập
                    </h3>
                    <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold">
                      {exercises.length} bài
                    </span>
                  </div>
                  {exercises.length > 0 ? (
                    exercises.map((ex, idx) => (
                      <div
                        key={ex.id}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-indigo-500"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg mb-1">
                              Bài {idx + 1}: {ex.title}
                            </h4>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {ex.description}
                            </p>
                          </div>
                          <button className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm hover:shadow">
                            Làm bài
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-center">
                      <p className="text-gray-500 font-medium">
                        Video này chưa có bài tập nào.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 3. HỎI ĐÁP */}
              {activeTab === "qa" && (
                <div className="animate-fadeIn">
                  <div className="bg-white p-8 rounded-xl border border-gray-200 text-center shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Thảo luận cùng Giảng viên & Học viên
                    </h3>
                    <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 font-medium transition shadow-sm">
                      Đặt câu hỏi mới
                    </button>
                  </div>
                </div>
              )}

              {/* 4. ĐÁNH GIÁ */}
              {activeTab === "reviews" && (
                <div className="animate-fadeIn">
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {review.user.charAt(0)}
                            </div>
                            <div className="font-bold text-gray-900 text-sm">
                              {review.user}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm pl-13">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- SIDEBAR (PHẢI) - COURSE CONTENT --- */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-xl z-20 flex-shrink-0">
          <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-800">Nội dung khóa học</h3>
            {/* 🔥 SỬA: HIỂN THỊ SỐ BÀI ĐÃ HỌC THẬT */}
            <span className="text-xs font-semibold text-gray-500">
              {completedLessons}/{totalLessons} bài
            </span>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
            {sections.map((section, idx) => (
              <div key={section.id} className="border-b border-gray-100">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-5 py-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center text-left transition group"
                >
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">
                      Chương {idx + 1}: {section.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {section.lessons.length} bài học
                    </p>
                  </div>
                  <span
                    className={`transform transition-transform duration-300 text-gray-400 ${
                      expandedSections[section.id] ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedSections[section.id] ? "max-h-[1000px]" : "max-h-0"
                  }`}
                >
                  <ul className="bg-white">
                    {section.lessons.map((lesson, lessonIdx) => {
                      const isActive = currentLesson?.id === lesson.id;
                      const isCompleted =
                        lesson.completed || lesson.isCompleted; // Lấy trạng thái thật

                      return (
                        <li key={lesson.id} className="relative group">
                          <div
                            onClick={() => handleSelectLesson(lesson)}
                            className={`w-full px-5 py-3 flex gap-3 text-left cursor-pointer transition-colors border-l-4 ${
                              isActive
                                ? "bg-indigo-50 border-indigo-600"
                                : "border-transparent hover:bg-gray-50"
                            }`}
                          >
                            <div className="mt-1 flex-shrink-0">
                              {/* Icon Tick xanh nếu hoàn thành */}
                              {isCompleted ? (
                                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 text-white"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              ) : isActive ? (
                                <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                </div>
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium truncate ${
                                  isActive ? "text-indigo-700" : "text-gray-700"
                                }`}
                              >
                                {lessonIdx + 1}. {lesson.title}
                              </p>
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  {lesson.duration || "05:00"}
                                </span>
                                {lesson.type === "video" && (
                                  <button
                                    onClick={(e) =>
                                      handleViewExercisesDirectly(e, lesson)
                                    }
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-opacity duration-200 
                                          ${
                                            isActive
                                              ? "opacity-100 border-indigo-200 bg-white text-indigo-600"
                                              : "opacity-0 group-hover:opacity-100 border-gray-200 bg-white text-gray-500 hover:text-indigo-600 hover:border-indigo-200"
                                          }
                                       `}
                                    title="Xem bài tập của video này"
                                  >
                                    Bài tập
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearningPage;
