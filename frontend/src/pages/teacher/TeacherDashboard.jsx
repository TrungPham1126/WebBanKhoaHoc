import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import CourseModal from "../../components/teacher/CourseModal";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await axiosClient.get("/courses/my-courses");
      setCourses(res.data);
    } catch (error) {
      console.error("Lỗi tải khóa học:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa khóa học này? Hành động này không thể hoàn tác."
      )
    ) {
      try {
        await axiosClient.delete(`/courses/${id}`);
        setCourses(courses.filter((c) => c.id !== id));
        alert("Đã xóa thành công!");
      } catch (e) {
        console.error(e);
        alert("Lỗi khi xóa khóa học.");
      }
    }
  };

  const handleEditRedirect = (id) => {
    navigate(`/teacher/course/${id}/edit`);
  };

  // --- HÀM XỬ LÝ TẠO MỚI (ĐÃ FIX LỖI) ---
  const handleCreateCourse = async (formData) => {
    const data = new FormData();
    // Đảm bảo tên trường khớp chính xác với @RequestParam trong Controller Java
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);

    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      // Gửi request với header multipart/form-data rõ ràng
      await axiosClient.post("/courses", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsModalOpen(false);
      fetchCourses();
      alert("Tạo khóa học thành công!");
    } catch (error) {
      console.error("Chi tiết lỗi:", error);
      // Hiển thị lỗi chi tiết từ Backend trả về (nếu có)
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Có lỗi xảy ra khi tạo khóa học.";
      alert(`Lỗi: ${msg}`);
    }
  };

  if (isLoading)
    return (
      <div className="p-10 text-center text-gray-500">Đang tải dữ liệu...</div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen bg-gray-50 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý khóa học</h1>
          <p className="text-gray-500 mt-1">
            Quản lý các khóa học và nội dung giảng dạy của bạn.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition shadow-lg shadow-purple-500/30 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Tạo khóa học mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Khóa học</th>
                <th className="px-6 py-4">Giá</th>
                <th className="px-6 py-4 text-center">Học viên</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courses.map((course) => (
                <tr
                  key={course.id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 max-w-md">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          course.imageUrl
                            ? `http://localhost:8080${course.imageUrl}`
                            : "https://via.placeholder.com/150?text=No+Image"
                        }
                        className="w-20 h-14 object-cover rounded-md border border-gray-200 flex-shrink-0"
                        alt="Thumbnail"
                      />
                      <div>
                        <div
                          className="font-bold text-gray-900 line-clamp-1"
                          title={course.title}
                        >
                          {course.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {course.description || "Chưa có mô tả"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium whitespace-nowrap">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(course.price)}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">
                    {course.studentCount || 0}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* Logic hiển thị màu sắc theo trạng thái */}
                    {course.status === "APPROVED" && (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                        Đã duyệt
                      </span>
                    )}
                    {course.status === "PENDING" && (
                      <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full border border-yellow-200">
                        Chờ duyệt
                      </span>
                    )}
                    {course.status === "REJECTED" && (
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full border border-red-200">
                        Từ chối
                      </span>
                    )}
                    {/* Trường hợp null hoặc khác */}
                    {!["APPROVED", "PENDING", "REJECTED"].includes(
                      course.status
                    ) && (
                      <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                        {course.status || "Pending"}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleEditRedirect(course.id)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded text-sm font-medium mr-2 transition border border-blue-200"
                    >
                      Sửa & Bài giảng
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded text-sm font-medium transition border border-red-200"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {courses.length === 0 && (
          <div className="p-16 text-center">
            <div className="bg-purple-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 text-purple-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Chưa có khóa học nào
            </h3>
            <p className="text-gray-500 mt-1">
              Bắt đầu chia sẻ kiến thức của bạn bằng cách tạo khóa học đầu tiên.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 text-purple-600 font-bold hover:underline"
            >
              Tạo khóa học ngay →
            </button>
          </div>
        )}
      </div>

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCourse}
        initialData={null}
      />
    </div>
  );
};

export default TeacherDashboard;
