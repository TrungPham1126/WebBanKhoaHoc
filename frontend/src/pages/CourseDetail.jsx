import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // State lưu trạng thái: User đã mua khóa này chưa?
  const [isEnrolled, setIsEnrolled] = useState(false);

  // --- HÀM HELPER: XỬ LÝ URL ẢNH (Fix lỗi ERR_NAME_NOT_RESOLVED) ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/600x400?text=No+Image";
    // Nếu là link online (http...) thì giữ nguyên
    if (imagePath.startsWith("http")) return imagePath;

    // Nếu là link nội bộ (/images/...), nối với localhost backend
    // Bạn có thể thay localhost:8080 bằng domain thật khi deploy
    return `http://localhost:8080${imagePath}`;
  };

  // 1. Load thông tin khóa học
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axiosClient.get(`/courses/${id}`);
        // Backend có thể trả về res.data hoặc res.data.data tùy wrapper
        setCourse(res.data.data || res.data);
      } catch (error) {
        console.error("Lỗi tải khóa học", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  // 2. Load trạng thái ghi danh (Chỉ chạy khi đã login & có ID khóa học)
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user?.id) return; // Chưa login thì thôi

      try {
        // Gọi sang Enrollment Service để lấy danh sách khóa đã mua
        const res = await axiosClient.get("/enrollments/my-courses");
        const myCourses = res.data.data || res.data || [];

        // Kiểm tra xem khóa học hiện tại (id) có trong danh sách đã mua không
        // So sánh lỏng (==) để tránh lệch kiểu string/number
        const check = myCourses.some((item) => item.courseId == id);

        setIsEnrolled(check);
      } catch (error) {
        console.error("Lỗi kiểm tra ghi danh:", error);
      }
    };

    if (id) {
      checkEnrollment();
    }
  }, [user, id]);

  // --- HÀM THANH TOÁN ---
  const handleBuyCourse = async () => {
    // Check Login
    if (!user) {
      if (window.confirm("Bạn cần đăng nhập để mua khóa học này!")) {
        navigate("/login");
      }
      return;
    }

    if (!course) return;

    // Lấy TeacherID An Toàn (Tránh lỗi null hoặc mặc định sai)
    const safeTeacherId = course.teacherId || course.userId || null;
    const safeTeacherEmail =
      course.teacherEmail || course.email || "admin@system.com";

    if (!safeTeacherId || safeTeacherId === 1) {
      alert(
        "Lỗi hệ thống: Không thể xác định thông tin giáo viên để xử lý thanh toán."
      );
      return;
    }

    try {
      // Gọi API Payment
      const res = await axiosClient.get("/payments/create_payment", {
        params: {
          amount: course.price,
          courseId: course.id,
          courseTitle: course.title,
          email: user.email,
          teacherEmail: safeTeacherEmail,
          teacherId: safeTeacherId,
        },
      });

      if (res.data && (res.data.status === "OK" || res.data.url)) {
        // Chuyển hướng sang VNPAY
        window.location.href = res.data.url || res.data.URL;
      } else {
        alert(
          "Lỗi tạo giao dịch: " + (res.data.message || "Không có URL trả về")
        );
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert(
        "Lỗi khi tạo thanh toán: " +
          (error.response?.data?.message || "Vui lòng thử lại sau")
      );
    }
  };

  // --- HÀM VÀO HỌC ---
  const handleLearnNow = () => {
    // Chuyển hướng đến trang học (Learning Page)
    navigate(`/learn/${id}`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (!course)
    return (
      <div className="text-center py-20 text-gray-500">
        Khóa học không tồn tại hoặc đã bị xóa.
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- CỘT TRÁI: NỘI DUNG KHÓA HỌC --- */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tiêu đề & Mô tả */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-4">
              {course.title}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Thông tin Giảng viên */}
          <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl uppercase border-2 border-white shadow-sm">
              {course.teacherName ? course.teacherName.charAt(0) : "T"}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Giảng viên
              </p>
              <p className="text-lg font-bold text-gray-800">
                {course.teacherName || course.teacherEmail || "Giảng viên"}
              </p>
            </div>
          </div>

          {/* Danh sách bài học */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[300px]">
            <h3 className="font-bold text-xl mb-4 border-b pb-2 text-gray-800">
              Nội dung khóa học
            </h3>

            <div className="space-y-3">
              {/* Demo nội dung */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="material-icons text-indigo-500">
                  play_circle
                </span>
                <span className="text-gray-700 font-medium">
                  Giới thiệu khóa học
                </span>
                <span className="ml-auto text-xs text-gray-400">Học thử</span>
              </div>

              {/* Logic hiển thị dựa trên enrollment */}
              {isEnrolled ? (
                <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Bạn đã sở hữu khóa học này. Nhấn "Vào học ngay" để bắt đầu.
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg opacity-60">
                    <span className="material-icons text-gray-400">lock</span>
                    <span className="text-gray-700 font-medium">
                      Bài 1: Kiến thức cơ bản
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 italic mt-4 pl-2">
                    * Đăng ký mua để mở khóa trọn bộ nội dung.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: CARD MUA / VÀO HỌC --- */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-24">
            {/* Ảnh Khóa Học (Dùng hàm helper getImageUrl) */}
            <div className="h-48 bg-gray-200 relative group">
              <img
                src={getImageUrl(course.imageUrl)}
                alt={course.title}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/600x400?text=No+Image";
                }}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition"></div>
            </div>

            <div className="p-6">
              {/* Giá tiền */}
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(course.price)}
                </span>
              </div>

              {/* 🔥 NÚT BẤM: ĐỔI MÀU VÀ CHỨC NĂNG THEO TRẠNG THÁI MUA */}
              {isEnrolled ? (
                <button
                  onClick={handleLearnNow}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition transform active:scale-[0.98] flex justify-center items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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
                  Vào học ngay
                </button>
              ) : (
                <button
                  onClick={handleBuyCourse}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition transform active:scale-[0.98] flex justify-center items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path
                      fillRule="evenodd"
                      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Mua ngay
                </button>
              )}

              {/* Các icon phụ */}
              <div className="mt-6 space-y-3 text-sm text-gray-600 border-t pt-4 border-gray-50">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Truy cập trọn đời
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Học trên mọi thiết bị
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Cấp chứng chỉ hoàn thành
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
