import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      // Gọi API lấy tất cả khóa học (Backend đã viết ở bước trước)
      const res = await axiosClient.get("/courses/admin/all");
      setCourses(res.data);
    } catch (error) {
      console.error("Lỗi tải khóa học:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Hàm xử lý duyệt
  const handleApprove = async (id) => {
    if (!window.confirm("Xác nhận DUYỆT khóa học này?")) return;
    try {
      await axiosClient.put(`/courses/${id}/approve`);
      fetchCourses(); // Load lại danh sách
    } catch (e) {
      alert("Lỗi khi duyệt");
    }
  };

  // Hàm xử lý từ chối
  const handleReject = async (id) => {
    if (!window.confirm("Xác nhận TỪ CHỐI khóa học này?")) return;
    try {
      await axiosClient.put(`/courses/${id}/reject`);
      fetchCourses();
    } catch (e) {
      alert("Lỗi khi từ chối");
    }
  };

  // --- HÀM MỚI: XÓA KHÓA HỌC ---
  const handleDelete = async (id) => {
    if (
      window.confirm(
        "CẢNH BÁO: Bạn có chắc chắn muốn XÓA VĨNH VIỄN khóa học này? Hành động này không thể hoàn tác."
      )
    ) {
      try {
        // Gọi API xóa của Admin
        await axiosClient.delete(`/courses/admin/${id}`);
        alert("Đã xóa khóa học thành công!");
        // Cập nhật giao diện: Lọc bỏ khóa học vừa xóa
        setCourses(courses.filter((c) => c.id !== id));
      } catch (e) {
        console.error(e);
        alert("Lỗi khi xóa khóa học. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Quản lý Khóa Học
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Khóa học</th>
              <th className="px-6 py-4">Giảng viên</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900 mb-1">
                    {course.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Intl.NumberFormat("vi-VN").format(course.price)} đ
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {course.teacherName}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      course.status === "APPROVED"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : course.status === "REJECTED"
                        ? "bg-red-100 text-red-700 border-red-200"
                        : "bg-yellow-100 text-yellow-700 border-yellow-200"
                    }`}
                  >
                    {course.status === "APPROVED"
                      ? "Đã duyệt"
                      : course.status === "REJECTED"
                      ? "Từ chối"
                      : "Chờ duyệt"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {course.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleApprove(course.id)}
                        className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-green-700 transition"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleReject(course.id)}
                        className="bg-yellow-500 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-yellow-600 transition"
                      >
                        Từ chối
                      </button>
                    </>
                  )}

                  {/* Nút Xóa luôn hiện */}
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="bg-red-100 text-red-600 px-3 py-1.5 rounded text-xs font-bold hover:bg-red-200 border border-red-200 transition"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-10 text-center text-gray-500 italic"
                >
                  Chưa có khóa học nào trong hệ thống.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCourses;
