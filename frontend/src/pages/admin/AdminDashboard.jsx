import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";

const AdminDashboard = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalCourses: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi song song 3 API
        const [payRes, userRes, courseRes] = await Promise.all([
          axiosClient.get("/payments/history"),
          axiosClient.get("/users"),
          axiosClient.get("/courses/admin/all"),
        ]);

        // 1. Xử lý dữ liệu Doanh thu (Theo ngày)
        const revenueMap = {};
        let totalRev = 0;
        payRes.data.forEach((t) => {
          // Lấy ngày tháng năm (VD: 23/11)
          const date = format(parseISO(t.createdAt), "dd/MM");
          revenueMap[date] = (revenueMap[date] || 0) + t.totalAmount;
          totalRev += t.totalAmount;
        });
        // Chuyển object thành array cho Recharts
        const chartRevenue = Object.keys(revenueMap).map((key) => ({
          name: key,
          total: revenueMap[key],
        }));
        setRevenueData(chartRevenue);

        // 2. Xử lý dữ liệu Người dùng (Theo ngày)
        // Lưu ý: Nếu User cũ chưa có createdAt thì sẽ bị lỗi, cần check
        const userMap = {};
        userRes.data.forEach((u) => {
          const date = u.createdAt
            ? format(parseISO(u.createdAt), "dd/MM")
            : "N/A";
          if (date !== "N/A") {
            userMap[date] = (userMap[date] || 0) + 1;
          }
        });
        const chartUser = Object.keys(userMap).map((key) => ({
          name: key,
          users: userMap[key],
        }));
        setUserData(chartUser);

        // 3. Xử lý dữ liệu Khóa học (Theo trạng thái)
        const statusCount = { APPROVED: 0, PENDING: 0, REJECTED: 0 };
        courseRes.data.forEach((c) => {
          const status = c.status || "PENDING";
          statusCount[status] = (statusCount[status] || 0) + 1;
        });
        const chartCourse = [
          { name: "Đã duyệt", count: statusCount.APPROVED },
          { name: "Chờ duyệt", count: statusCount.PENDING },
          { name: "Từ chối", count: statusCount.REJECTED },
        ];
        setCourseData(chartCourse);

        // Cập nhật thống kê tổng
        setStats({
          totalRevenue: totalRev,
          totalUsers: userRes.data.length,
          totalCourses: courseRes.data.length,
        });
      } catch (error) {
        console.error("Lỗi tải Dashboard:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h1>

      {/* --- 3 CARDS THỐNG KÊ --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100">
          <p className="text-gray-500 text-sm font-medium">Tổng doanh thu</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(stats.totalRevenue)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
          <p className="text-gray-500 text-sm font-medium">Tổng người dùng</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {stats.totalUsers}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
          <p className="text-gray-500 text-sm font-medium">Tổng khóa học</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {stats.totalCourses}
          </p>
        </div>
      </div>

      {/* --- BIỂU ĐỒ HÀNG 1: DOANH THU & NGƯỜI DÙNG --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Biểu đồ Doanh thu (Area Chart) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg text-gray-700 mb-6">
            Biểu đồ doanh thu (VNĐ)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip
                  formatter={(value) =>
                    new Intl.NumberFormat("vi-VN").format(value)
                  }
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ Người dùng mới (Bar Chart) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg text-gray-700 mb-6">
            Người dùng đăng ký mới
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="users"
                  name="Người dùng"
                  fill="#82ca9d"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- BIỂU ĐỒ HÀNG 2: TRẠNG THÁI KHÓA HỌC --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg text-gray-700 mb-6">
          Thống kê trạng thái khóa học
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={courseData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="count"
                name="Số lượng"
                fill="#f59e0b"
                barSize={30}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
