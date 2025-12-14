import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import VideoPlayer from "../../components/VideoPlayer";
import CourseModal from "../../components/teacher/CourseModal";

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // State quản lý hiển thị Form
  const [showVideoForm, setShowVideoForm] = useState(null);
  const [showExerciseForm, setShowExerciseForm] = useState(null);

  // State cho Upload Video
  const [videoFiles, setVideoFiles] = useState([]);
  const [videoTitle, setVideoTitle] = useState("");

  // 🔥 STATE CHO BÀI TẬP (Đã cập nhật thêm type và file)
  const [exerciseData, setExerciseData] = useState({
    title: "",
    description: "",
    type: "WRITING", // Mặc định
    file: null, // File đề bài (PDF/Docx...)
  });

  const [previewVideo, setPreviewVideo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await axiosClient.get(`/courses/${id}`);
        setCourse(courseRes.data);
        fetchContent();
      } catch (error) {
        console.error("Lỗi tải khóa học:", error);
        alert("Không thể tải thông tin khóa học");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const fetchContent = async () => {
    try {
      const contentRes = await axiosClient.get(`/courses/${id}/content`);
      setSections(contentRes.data);
    } catch (e) {
      console.log("Chưa có nội dung");
    }
  };

  const handleUpdateCourse = async (formData) => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    if (formData.image) data.append("image", formData.image);

    try {
      const res = await axiosClient.put(`/courses/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCourse(res.data);
      setIsEditModalOpen(false);
      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      alert("Lỗi khi cập nhật khóa học!");
    }
  };

  const handleAddSection = async () => {
    const title = prompt("Nhập tên chương mới:");
    if (title) {
      try {
        await axiosClient.post(`/courses/${id}/sections`, { title });
        fetchContent();
      } catch (e) {
        alert("Lỗi thêm chương");
      }
    }
  };

  const handleAddVideo = async (sectionId) => {
    if (!videoFiles || videoFiles.length === 0)
      return alert("Vui lòng chọn ít nhất 1 video");

    const totalFiles = videoFiles.length;
    const confirmMsg =
      totalFiles > 1
        ? `Bạn đang tải lên ${totalFiles} video cùng lúc. Quá trình này sẽ chạy ngầm. Bạn có muốn tiếp tục?`
        : null;

    if (confirmMsg && !window.confirm(confirmMsg)) return;

    const filesArray = Array.from(videoFiles);

    try {
      await Promise.all(
        filesArray.map((file) => {
          const formData = new FormData();
          let titleToUse = file.name.replace(/\.[^/.]+$/, "");
          if (filesArray.length === 1 && videoTitle.trim() !== "") {
            titleToUse = videoTitle;
          }

          formData.append("title", titleToUse);
          formData.append("file", file);
          formData.append("sectionId", sectionId);

          return axiosClient.post(`/videos/courses/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        })
      );

      alert(`Đã đẩy ${totalFiles} video vào hàng đợi xử lý ngầm!`);
      setShowVideoForm(null);
      setVideoFiles([]);
      setVideoTitle("");
      fetchContent();
    } catch (e) {
      console.error(e);
      alert("Có lỗi xảy ra khi upload một số video. Vui lòng kiểm tra lại.");
    }
  };

  // 🔥 HÀM THÊM BÀI TẬP (ĐÃ SỬA LOGIC)
  const handleAddExercise = async (videoId) => {
    if (!exerciseData.title) return alert("Nhập tiêu đề bài tập");

    const formData = new FormData();
    formData.append("title", exerciseData.title);
    formData.append("description", exerciseData.description);
    formData.append("videoId", videoId);
    formData.append("type", exerciseData.type); // Gửi loại bài tập
    formData.append("isFree", false);

    // Gửi file nếu có
    if (exerciseData.file) {
      formData.append("file", exerciseData.file);
    }

    try {
      await axiosClient.post(`/exercises`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Thêm bài tập thành công!");
      setShowExerciseForm(null);
      // Reset form
      setExerciseData({
        title: "",
        description: "",
        type: "WRITING",
        file: null,
      });
      fetchContent();
    } catch (e) {
      console.error(e);
      alert("Lỗi thêm bài tập: " + (e.response?.data?.message || "Lỗi server"));
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm("Bạn chắc chắn muốn xóa video này?")) {
      try {
        await axiosClient.delete(`/videos/${videoId}`);
        fetchContent();
      } catch (e) {
        alert("Lỗi khi xóa video");
      }
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">Đang tải dữ liệu...</div>
    );
  if (!course)
    return (
      <div className="p-10 text-center text-red-500">
        Không tìm thấy khóa học
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Biên tập nội dung</h1>
        <button
          onClick={() => navigate("/teacher/dashboard")}
          className="text-gray-600 hover:text-purple-700 font-medium transition"
        >
          ← Quay lại Dashboard
        </button>
      </div>

      {/* Course Info Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 flex gap-6 items-start">
        <img
          src={
            course.imageUrl
              ? `http://localhost:8080${course.imageUrl}`
              : "https://via.placeholder.com/150"
          }
          alt=""
          className="h-28 w-48 object-cover rounded border border-gray-100 bg-gray-50"
        />
        <div className="flex-grow">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {course.title}
          </h2>
          <p className="text-sm text-gray-600 line-clamp-2 max-w-xl mb-2">
            {course.description}
          </p>
          <p className="text-sm font-semibold text-purple-700">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(course.price)}
          </p>
        </div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex-shrink-0 flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium text-sm transition border border-blue-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
          Chỉnh sửa thông tin
        </button>
      </div>

      {/* Sections & Lessons */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-purple-700">
            Nội dung chương trình
          </h2>
          <button
            onClick={handleAddSection}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 font-medium transition shadow-md"
          >
            + Thêm chương mới
          </button>
        </div>

        <div className="space-y-4">
          {sections.map((section, idx) => (
            <div
              key={section.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-100">
                <div className="font-bold text-gray-800">
                  Chương {idx + 1}: {section.title}
                </div>
                <button
                  onClick={() =>
                    setShowVideoForm(
                      showVideoForm === section.id ? null : section.id
                    )
                  }
                  className="text-sm text-purple-600 hover:bg-purple-50 px-3 py-1 rounded border border-purple-200 font-medium transition"
                >
                  + Thêm Video
                </button>
              </div>

              {/* Form Upload Video */}
              {showVideoForm === section.id && (
                <div className="p-4 bg-purple-50 border-b border-purple-100 animate-fadeIn">
                  <h4 className="font-bold text-sm mb-2 text-purple-800">
                    Upload Video Mới (Hỗ trợ nhiều file)
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-3 items-start">
                    <div className="flex-grow w-full space-y-2">
                      <input
                        type="file"
                        accept="video/*"
                        multiple
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer"
                        onChange={(e) => setVideoFiles(e.target.files)}
                      />
                      {videoFiles && videoFiles.length > 1 ? (
                        <p className="text-xs text-gray-500 italic pl-2">
                          * Bạn đã chọn {videoFiles.length} file. Tiêu đề sẽ tự
                          động lấy theo tên file.
                        </p>
                      ) : (
                        <input
                          type="text"
                          placeholder="Tiêu đề bài giảng (Để trống sẽ lấy tên file)"
                          className="w-full p-2 border border-purple-200 rounded text-sm focus:outline-none focus:border-purple-500 bg-white"
                          value={videoTitle}
                          onChange={(e) => setVideoTitle(e.target.value)}
                        />
                      )}
                    </div>
                    <button
                      onClick={() => handleAddVideo(section.id)}
                      className="bg-purple-600 text-white px-6 py-2 rounded text-sm hover:bg-purple-700 h-10 font-medium transition w-full sm:w-auto whitespace-nowrap mt-1"
                    >
                      Upload Ngay
                    </button>
                  </div>
                </div>
              )}

              {/* Lesson List */}
              <div className="divide-y divide-gray-100 bg-white">
                {section.lessons &&
                  section.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="p-4 flex justify-between items-center hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-gray-100 p-2.5 rounded-lg text-xl flex-shrink-0">
                          {lesson.type === "video" ? "🎥" : "📝"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">
                            {lesson.title}
                          </p>
                          {lesson.type === "video" && (
                            <div className="text-xs mt-1">
                              {!lesson.status || lesson.status === "READY" ? (
                                <span className="text-green-600 font-bold flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full w-fit">
                                  ✓ Sẵn sàng
                                </span>
                              ) : lesson.status === "PROCESSING" ? (
                                <span className="text-orange-600 font-bold flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-full w-fit animate-pulse">
                                  ⏳ Đang xử lý...
                                </span>
                              ) : (
                                <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full w-fit">
                                  ⚠ Lỗi xử lý
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {lesson.type === "video" && (
                          <>
                            <button
                              onClick={() =>
                                setPreviewVideo({
                                  url: `http://localhost:8080${lesson.videoUrl}`,
                                  title: lesson.title,
                                })
                              }
                              className="text-xs text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50 transition flex items-center gap-1"
                            >
                              Xem
                            </button>
                            <button
                              onClick={() => setShowExerciseForm(lesson.id)}
                              className="text-xs text-indigo-600 border border-indigo-200 px-2 py-1 rounded hover:bg-indigo-50 transition"
                            >
                              + Bài tập
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteVideo(lesson.id)}
                          className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition"
                        >
                          Xóa
                        </button>
                      </div>

                      {/* 🔥 FORM THÊM BÀI TẬP (ĐÃ CẬP NHẬT) */}
                      {showExerciseForm === lesson.id && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl animate-scale-up">
                            <h3 className="font-bold text-lg mb-4 text-gray-800">
                              Thêm bài tập cho: {lesson.title}
                            </h3>

                            {/* 1. Tiêu đề */}
                            <input
                              className="w-full border p-3 rounded-lg mb-3 outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="Tiêu đề bài tập"
                              value={exerciseData.title}
                              onChange={(e) =>
                                setExerciseData({
                                  ...exerciseData,
                                  title: e.target.value,
                                })
                              }
                            />

                            {/* 2. Loại bài tập */}
                            <select
                              className="w-full border p-3 rounded-lg mb-3 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                              value={exerciseData.type}
                              onChange={(e) =>
                                setExerciseData({
                                  ...exerciseData,
                                  type: e.target.value,
                                })
                              }
                            >
                              <option value="WRITING">Tự luận (Writing)</option>
                              <option value="VOCABULARY">
                                Từ vựng (Vocabulary)
                              </option>
                              <option value="GRAMMAR">
                                Ngữ pháp (Grammar)
                              </option>
                              <option value="READING">
                                Đọc hiểu (Reading)
                              </option>
                              <option value="LISTENING">
                                Nghe (Listening)
                              </option>
                              <option value="SPEAKING">Nói (Speaking)</option>
                            </select>

                            {/* 3. Mô tả */}
                            <textarea
                              className="w-full border p-3 rounded-lg mb-3 outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="Mô tả / Câu hỏi"
                              rows="3"
                              value={exerciseData.description}
                              onChange={(e) =>
                                setExerciseData({
                                  ...exerciseData,
                                  description: e.target.value,
                                })
                              }
                            />

                            {/* 4. Upload File */}
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                File đề bài (Tùy chọn)
                              </label>
                              <input
                                type="file"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                onChange={(e) =>
                                  setExerciseData({
                                    ...exerciseData,
                                    file: e.target.files[0],
                                  })
                                }
                              />
                            </div>

                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => setShowExerciseForm(null)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                              >
                                Hủy
                              </button>
                              <button
                                onClick={() => handleAddExercise(lesson.id)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                              >
                                Lưu bài tập
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      <CourseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateCourse}
        initialData={course}
      />

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl relative">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setPreviewVideo(null)}
                className="text-white/70 hover:text-white bg-black/50 rounded-full p-2 transition"
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
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <VideoPlayer
              src={previewVideo.url}
              poster={`http://localhost:8080${course.imageUrl}`}
            />
            <div className="p-4 text-white font-medium text-center bg-gray-900">
              {previewVideo.title}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCoursePage;
