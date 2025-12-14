import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

const BecomeTeacherPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Lấy hàm logout từ context
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!window.confirm("Bạn chắc chắn muốn trở thành giáo viên?")) return;

    setLoading(true);
    try {
      // Gọi API Backend
      await axiosClient.post("/users/become-teacher");

      alert(
        "Đăng ký thành công! Vui lòng đăng nhập lại để cập nhật quyền Giáo viên."
      );

      // 🔥 Quan trọng: Phải logout để user đăng nhập lại lấy Token mới (có ROLE_TEACHER)
      logout();
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error.response?.data || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white max-w-2xl w-full p-8 rounded-2xl shadow-xl text-center">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10 text-indigo-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.499 5.221 69.17 69.17 0 0 0-2.592.813m-15.482 0c.895.168 1.782.36 2.658.567"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Trở thành Giảng viên
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Chia sẻ kiến thức của bạn, kiếm thu nhập thụ động và giúp đỡ hàng ngàn
          học viên trên toàn thế giới. Khi trở thành giáo viên, bạn sẽ có quyền:
        </p>

        <ul className="text-left text-gray-700 space-y-3 mb-8 max-w-md mx-auto">
          <li className="flex items-center gap-3">
            <span className="text-green-500">✓</span> Đăng tải khóa học không
            giới hạn
          </li>
          <li className="flex items-center gap-3">
            <span className="text-green-500">✓</span> Quản lý doanh thu và học
            viên
          </li>
          <li className="flex items-center gap-3">
            <span className="text-green-500">✓</span> Tạo bài tập và chấm điểm
          </li>
        </ul>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Để sau
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30 disabled:bg-indigo-400"
          >
            {loading ? "Đang xử lý..." : "Xác nhận đăng ký"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BecomeTeacherPage;
