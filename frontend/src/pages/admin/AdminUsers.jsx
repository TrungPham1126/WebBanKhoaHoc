import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import AdminHeader from "../../components/admin/AdminHeader";

// 1. Import Chart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

// 2. Đăng ký thành phần
ChartJS.register(ArcElement, Tooltip, Legend);

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State lưu thống kê role
  const [roleStats, setRoleStats] = useState({
    admin: 0,
    teacher: 0,
    student: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosClient.get("/users");
      const userList = res.data;
      setUsers(userList);

      // --- LOGIC TÍNH TOÁN SỐ LƯỢNG ROLE ---
      const stats = {
        admin: 0,
        teacher: 0,
        student: 0,
      };

      userList.forEach((user) => {
        // Kiểm tra role và tăng biến đếm
        // Ưu tiên: Admin > Teacher > Student (nếu 1 user có nhiều quyền)
        if (user.roles.includes("ROLE_ADMIN")) {
          stats.admin++;
        } else if (user.roles.includes("ROLE_TEACHER")) {
          stats.teacher++;
        } else {
          stats.student++;
        }
      });

      setRoleStats(stats);
    } catch (err) {
      console.error("Lỗi tải danh sách user:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- CẤU HÌNH BIỂU ĐỒ TRÒN ---
  const chartData = {
    labels: ["Admin", "Giáo viên", "Học viên"],
    datasets: [
      {
        data: [roleStats.admin, roleStats.teacher, roleStats.student],
        backgroundColor: [
          "#ef4444", // Admin: Đỏ
          "#3b82f6", // Teacher: Xanh dương
          "#10b981", // Student: Xanh lá
        ],
        borderWidth: 0, // Bỏ viền để đẹp hơn
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { display: false }, // Tắt legend mặc định để dùng Custom Legend đẹp hơn
    },
    maintainAspectRatio: false,
  };

  if (loading)
    return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Quản lý Người dùng"
        subtitle="Danh sách và phân quyền tài khoản hệ thống"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- CỘT TRÁI: BIỂU ĐỒ THỐNG KÊ (Chiếm 1 cột) --- */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-bold text-gray-700 mb-4">Cơ cấu thành viên</h3>

          {/* Vùng chứa biểu đồ */}
          <div className="flex-grow flex items-center justify-center relative min-h-[200px]">
            <div className="w-48 h-48">
              <Pie data={chartData} options={chartOptions} />
            </div>
            {/* Tổng số ở giữa (nếu muốn làm Doughnut chart), ở đây là Pie nên để trống */}
          </div>

          {/* Custom Legend (Chú thích) */}
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-sm text-gray-600">Quản trị viên</span>
              </div>
              <span className="font-bold text-gray-800">{roleStats.admin}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-sm text-gray-600">Giáo viên</span>
              </div>
              <span className="font-bold text-gray-800">
                {roleStats.teacher}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-sm text-gray-600">Học viên</span>
              </div>
              <span className="font-bold text-gray-800">
                {roleStats.student}
              </span>
            </div>
            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-500">Tổng cộng</span>
              <span className="font-bold text-xl text-gray-900">
                {users.length}
              </span>
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: DANH SÁCH USER (Chiếm 2 cột) --- */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-700">Danh sách tài khoản</h3>
            <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-500">
              Hiển thị tất cả
            </span>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white text-gray-500 text-xs uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Thông tin cá nhân</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 text-center">Vai trò</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-400 text-xs font-mono">
                      #{user.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 uppercase">
                          {user.fullName ? user.fullName.charAt(0) : "U"}
                        </div>
                        <span className="font-medium text-gray-900 text-sm">
                          {user.fullName || "Chưa cập nhật"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-1">
                        {user.roles.map((role) => (
                          <span
                            key={role}
                            className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                              role === "ROLE_ADMIN"
                                ? "bg-red-50 text-red-600 border-red-100"
                                : role === "ROLE_TEACHER"
                                ? "bg-blue-50 text-blue-600 border-blue-100"
                                : "bg-emerald-50 text-emerald-600 border-emerald-100"
                            }`}
                          >
                            {role === "ROLE_ADMIN"
                              ? "Admin"
                              : role === "ROLE_TEACHER"
                              ? "Teacher"
                              : "Student"}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
