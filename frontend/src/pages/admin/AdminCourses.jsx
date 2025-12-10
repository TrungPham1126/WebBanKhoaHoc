import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import AdminHeader from "../../components/admin/AdminHeader";
import { Link } from "react-router-dom";

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [stats, setStats] = useState({ trend: [], topCourses: [] });
  const [loading, setLoading] = useState(true);

  // State cho bộ lọc
  const [sortConfig, setSortConfig] = useState("newest"); // newest, oldest, price_asc, price_desc, most_students
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  // Effect xử lý sắp xếp và tìm kiếm
  useEffect(() => {
    let result = [...courses];

    // 1. Tìm kiếm
    if (keyword) {
      result = result.filter((c) =>
        c.title.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // 2. Sắp xếp
    switch (sortConfig) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "most_students":
        result.sort((a, b) => (b.studentCount || 0) - (a.studentCount || 0));
        break;
      case "oldest":
        result.sort(
          (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        );
        break;
      case "newest":
      default:
        result.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
    }

    setFilteredCourses(result);
  }, [courses, sortConfig, keyword]);

  const fetchData = async () => {
    try {
      // Gọi song song 2 API
      const [coursesRes, statsRes] = await Promise.all([
        axiosClient.get("/courses/admin/all"),
        axiosClient.get("/courses/admin/stats"),
      ]);

      setCourses(coursesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- HÀM XỬ LÝ HÀNH ĐỘNG ---
  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa khóa học này vĩnh viễn?")) {
      try {
        await axiosClient.delete(`/courses/admin/${id}`);
        setCourses(courses.filter((c) => c.id !== id));
        alert("Đã xóa thành công!");
      } catch (e) {
        alert("Lỗi khi xóa!");
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      await axiosClient.put(`/courses/${id}/approve`);
      fetchData(); // Reload để cập nhật trạng thái
    } catch (e) {
      alert("Lỗi duyệt khóa học");
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosClient.put(`/courses/${id}/reject`);
      fetchData();
    } catch (e) {
      alert("Lỗi từ chối");
    }
  };

  // --- CONFIG CHARTS ---
  const barData = {
    labels: stats.trend.map((i) => i.label),
    datasets: [
      {
        label: "Khóa học mới",
        data: stats.trend.map((i) => i.value),
        backgroundColor: "#8b5cf6",
        borderRadius: 4,
        barThickness: 20,
      },
    ],
  };

  const pieData = {
    labels: stats.topCourses.map((i) => i.label),
    datasets: [
      {
        data: stats.topCourses.map((i) => i.value),
        backgroundColor: [
          "#ef4444",
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#6366f1",
        ],
        borderWidth: 0,
      },
    ],
  };

  if (loading) return <div className="p-10 text-center">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Quản lý Khóa học"
        subtitle="Theo dõi và kiểm duyệt nội dung toàn hệ thống"
      />

      {/* --- PHẦN 1: BIỂU ĐỒ THỐNG KÊ --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Khóa học mới trong tháng */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4">
            Khóa học tạo mới (30 ngày qua)
          </h3>
          <div className="h-64">
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true, ticks: { stepSize: 1 } },
                  x: { grid: { display: false } },
                },
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>

        {/* Chart 2: Top khóa học đông học viên */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-bold text-gray-700 mb-4">
            Top 5 khóa học đông học viên nhất
          </h3>
          <div className="flex-grow flex items-center justify-center">
            <div className="h-48 w-48">
              <Pie
                data={pieData}
                options={{
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
            {/* Custom Legend nhỏ gọn bên cạnh */}
            <div className="ml-6 space-y-2 text-sm max-w-[200px]">
              {stats.topCourses.map((c, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor:
                          pieData.datasets[0].backgroundColor[idx],
                      }}
                    ></span>
                    <span className="truncate text-gray-600" title={c.label}>
                      {c.label}
                    </span>
                  </div>
                  <span className="font-bold text-gray-800">{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- PHẦN 2: DANH SÁCH & BỘ LỌC --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khóa học..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Sắp xếp:</span>
            <select
              className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-purple-500 bg-white"
              value={sortConfig}
              onChange={(e) => setSortConfig(e.target.value)}
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="most_students">Nhiều học viên nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white text-gray-500 text-xs uppercase font-bold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Thông tin khóa học</th>
                <th className="px-6 py-4">Giảng viên</th>
                <th className="px-6 py-4 text-center">Giá</th>
                <th className="px-6 py-4 text-center">Học viên</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 max-w-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          course.imageUrl
                            ? `http://localhost:8080${course.imageUrl}`
                            : "https://via.placeholder.com/150"
                        }
                        alt=""
                        className="w-12 h-12 rounded object-cover border border-gray-200"
                      />
                      <div>
                        <div
                          className="font-bold text-gray-900 line-clamp-1"
                          title={course.title}
                        >
                          {course.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          Tạo:{" "}
                          {course.createdAt
                            ? new Date(course.createdAt).toLocaleDateString(
                                "vi-VN"
                              )
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {course.teacherName}
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-gray-900">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(course.price)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                      {course.studentCount || 0}
                    </span>
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
                  <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    {course.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleApprove(course.id)}
                          className="text-green-600 hover:bg-green-50 px-2 py-1 rounded transition text-xs font-bold border border-green-200"
                        >
                          ✓ Duyệt
                        </button>
                        <button
                          onClick={() => handleReject(course.id)}
                          className="text-yellow-600 hover:bg-yellow-50 px-2 py-1 rounded transition text-xs font-bold border border-yellow-200"
                        >
                          ✕ Từ chối
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition text-xs font-bold border border-red-200"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCourses.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-gray-500 italic"
                  >
                    Không tìm thấy khóa học nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;
