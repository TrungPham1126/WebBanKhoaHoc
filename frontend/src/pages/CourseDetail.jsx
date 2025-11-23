import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { AuthContext } from "../context/AuthContext";

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Lấy thông tin khóa học
        const courseRes = await axiosClient.get(`/courses/${id}`);
        setCourse(courseRes.data);

        // 2. Lấy nội dung bài học
        try {
          const contentRes = await axiosClient.get(`/courses/${id}/content`);
          setSections(contentRes.data);
        } catch (e) {
          console.log("Chưa có nội dung bài học");
        }

        // 3. Kiểm tra đã mua chưa
        if (user) {
          const enrollRes = await axiosClient.get("/enrollments/my-courses");
          const enrolled = enrollRes.data.some(
            (e) => e.courseId === parseInt(id)
          );
          setIsEnrolled(enrolled);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  // --- HÀM MỚI: Mua khóa học (đã sửa để gửi kèm ảnh) ---
  const handleBuyNow = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để mua khóa học!");
      return navigate("/login");
    }
    try {
      const params = new URLSearchParams({
        amount: course.price,
        courseId: course.id,
        courseTitle: course.title,
        email: user.email,
        teacherEmail: course.teacherName,
        // QUAN TRỌNG: Gửi thêm link ảnh để bên Payment lưu lại
        courseImage: course.imageUrl || "",
      });

      const res = await axiosClient.get(
        `/payments/create_payment?${params.toString()}`
      );
      if (res.data.status === "OK") window.location.href = res.data.url;
    } catch (error) {
      console.error(error);
      alert("Lỗi tạo thanh toán!");
    }
  };

  // Hàm helper xử lý link ảnh
  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/600x400?text=No+Image";
    return url.startsWith("http") ? url : `http://localhost:8080${url}`;
  };

  if (loading)
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-lg text-gray-500">
        Đang tải thông tin...
      </div>
    );
  if (!course)
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-lg text-red-500">
        Không tìm thấy khóa học
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen py-10 font-sans">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* --- CỘT TRÁI: THÔNG TIN KHÓA HỌC --- */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {course.title}
            </h1>

            <p className="text-lg text-gray-700 mb-6 leading-relaxed whitespace-pre-line">
              {course.description}
            </p>

            <div className="flex items-center gap-4 mb-8 text-sm text-gray-600">
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                {course.studentCount || 0} học viên
              </span>
              <span>
                Giảng viên:{" "}
                <span className="font-bold text-gray-900">
                  {course.teacherName}
                </span>
              </span>
            </div>

            {/* Danh sách chương học */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                <h2 className="font-bold text-lg text-gray-800">
                  Nội dung khóa học
                </h2>
              </div>

              {sections.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {sections.map((section, idx) => (
                    <div key={section.id} className="p-4">
                      <div className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                          {idx + 1}
                        </span>
                        {section.title}
                      </div>
                      <ul className="ml-8 space-y-2">
                        {section.lessons &&
                          section.lessons.map((lesson) => (
                            <li
                              key={lesson.id}
                              className="text-sm text-gray-600 flex justify-between items-center"
                            >
                              <div className="flex items-center gap-2">
                                <svg
                                  className="w-4 h-4 text-gray-400"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                                {lesson.title}
                              </div>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {lesson.duration || "Video"}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  Nội dung đang được cập nhật...
                </div>
              )}
            </div>
          </div>

          {/* --- CỘT PHẢI: MUA KHÓA HỌC --- */}
          <div className="lg:col-span-1">
            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 sticky top-24">
              <div className="rounded-lg overflow-hidden mb-5 border border-gray-100">
                <img
                  src={getImageUrl(course.imageUrl)}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/600x400?text=No+Image";
                  }}
                />
              </div>

              <div className="mb-6 text-center">
                <span className="text-3xl font-bold text-gray-900">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(course.price)}
                </span>
              </div>

              {isEnrolled ? (
                <button
                  // Sửa dòng này:
                  onClick={() => navigate(`/learn/${id}`)}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition shadow-lg shadow-green-500/30"
                >
                  Đã sở hữu - Vào học ngay
                </button>
              ) : (
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition shadow-lg shadow-purple-500/30"
                >
                  Mua ngay
                </button>
              )}

              <p className="text-center text-xs text-gray-400 mt-4">
                Truy cập trọn đời • Học trên mọi thiết bị
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
