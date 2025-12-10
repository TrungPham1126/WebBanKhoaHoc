import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import AdminHeader from "../../components/admin/AdminHeader";

// Import các thành phần của Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bảng màu cố định cho Top Course để đồng bộ giữa Chart và Legend tùy chỉnh
  const CHART_COLORS = [
    "#6366f1", // Indigo
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Violet
  ];

  const [mockStats] = useState({
    userTrend: "+5.4%",
    userTrendUp: true,
    courseTrend: "+2 mới",
    courseTrendUp: true,
    conversionTrend: "-0.5%",
    conversionTrendUp: false,
    conversionValue: "2.4%",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchDashboardData(), fetchUserStats()]);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await axiosClient.get("/payments/stats/dashboard");
      if (res.data && res.data.data) {
        setDashboardData(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi dashboard payment:", error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const res = await axiosClient.get("/users/stats");
      setUserStats(res.data);
    } catch (error) {
      console.error("Lỗi stats user:", error);
    }
  };

  const formatCurrency = (amount) => {
    const numAmount = Number(amount);
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(numAmount || 0);
  };

  // --- 1. CONFIG: Line Chart (Doanh thu) ---
  const lineChartData = {
    labels: dashboardData?.revenueChart?.map((d) => d.label) || [],
    datasets: [
      {
        label: "Doanh thu",
        data: dashboardData?.revenueChart?.map((d) => Number(d.value)) || [],
        fill: true,
        backgroundColor: "rgba(99, 102, 241, 0.1)", // Indigo nhạt
        borderColor: "#6366f1", // Indigo đậm
        tension: 0.4, // Đường cong mềm mại
        pointRadius: 4,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#6366f1",
        pointBorderWidth: 2,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 12,
        titleFont: { size: 13 },
        bodyFont: { size: 13 },
        callbacks: {
          label: (context) => formatCurrency(context.raw),
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        border: { display: false }, // Ẩn đường trục Y
        grid: { color: "#f1f5f9" }, // Màu lưới nhạt
        ticks: {
          font: { size: 11 },
          color: "#64748b",
          callback: (value) => value / 1000000 + "M",
        },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, color: "#64748b" },
      },
    },
  };

  // --- 2. CONFIG: Bar Chart (User Mới) ---
  const userChartData = {
    labels: userStats.map((d) => d.label),
    datasets: [
      {
        label: "Thành viên mới",
        data: userStats.map((d) => d.value),
        backgroundColor: "#8b5cf6", // Violet
        borderRadius: 4, // Bo góc cột
        borderSkipped: false,
        barThickness: "flex", // Tự động co giãn
        maxBarThickness: 40, // Không quá to
      },
    ],
  };

  const userChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 10,
        callbacks: {
          title: (items) => `Ngày: ${items[0].label}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: "#f1f5f9" },
        ticks: { stepSize: 1, color: "#64748b" },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: "#64748b",
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 7,
        },
      },
    },
  };

  // --- 3. CONFIG: Doughnut Chart (Top Courses) ---
  const doughnutData = {
    labels: dashboardData?.topCourses?.map((c) => c.label) || [],
    datasets: [
      {
        data: dashboardData?.topCourses?.map((c) => Number(c.value)) || [],
        backgroundColor: CHART_COLORS,
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%", // Làm vòng tròn mỏng hơn cho đẹp
    plugins: {
      legend: { display: false }, // Tắt legend mặc định để tự code Custom Legend
      tooltip: {
        backgroundColor: "#1e293b",
        bodyFont: { size: 13 },
      },
    },
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-purple-600 rounded-full mb-4 animate-bounce"></div>
          <div className="text-gray-500 font-medium">Đang tải dữ liệu...</div>
        </div>
      </div>
    );

  return (
    <div className="space-y-8 font-sans text-slate-800 pb-10">
      <AdminHeader
        title="Tổng quan hệ thống"
        subtitle="Theo dõi hiệu suất kinh doanh và tăng trưởng người dùng."
      />

      {/* --- SECTION 1: KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Tổng doanh thu"
          value={formatCurrency(dashboardData?.totalRevenue)}
          trend={mockStats.userTrend}
          trendUp={mockStats.userTrendUp}
          icon={
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          color="bg-indigo-50 text-indigo-600"
        />
        <KpiCard
          title="Người dùng mới (Hôm nay)"
          value={
            userStats.length > 0 ? userStats[userStats.length - 1].value : 0
          }
          trend={mockStats.userTrend}
          trendUp={mockStats.userTrendUp}
          icon={
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          }
          color="bg-emerald-50 text-emerald-600"
        />
        <KpiCard
          title="Khóa học hoạt động"
          value={dashboardData?.totalCourses || 45}
          trend={mockStats.courseTrend}
          trendUp={mockStats.courseTrendUp}
          icon={
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          }
          color="bg-amber-50 text-amber-600"
        />
        <KpiCard
          title="Tỉ lệ chuyển đổi"
          value={mockStats.conversionValue}
          trend={mockStats.conversionTrend}
          trendUp={mockStats.conversionTrendUp}
          icon={
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          }
          color="bg-rose-50 text-rose-600"
        />
      </div>

      {/* --- SECTION 2: CHARTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Doanh thu (Chiếm 2/3) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800">
              Biến động doanh thu
            </h3>
            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">
              30 ngày qua
            </span>
          </div>
          <div className="h-80 w-full">
            {lineChartData.labels.length > 0 ? (
              <Line data={lineChartData} options={lineOptions} />
            ) : (
              <EmptyState text="Chưa có dữ liệu doanh thu" />
            )}
          </div>
        </div>

        {/* Chart 2: Top Courses (Chiếm 1/3) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-bold text-lg text-slate-800 mb-6">
            Top khóa học bán chạy
          </h3>

          <div className="flex-grow flex flex-col items-center justify-center">
            {/* Vùng chứa Chart */}
            <div className="h-48 w-48 relative mb-6">
              {doughnutData.labels.length > 0 ? (
                <>
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                  {/* Số tổng ở giữa */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-extrabold text-slate-800">
                      {dashboardData?.topCourses?.reduce(
                        (acc, curr) => acc + Number(curr.value),
                        0
                      ) || 0}
                    </span>
                    <span className="text-xs text-slate-400 font-medium uppercase">
                      Đã bán
                    </span>
                  </div>
                </>
              ) : (
                <EmptyState text="Chưa có dữ liệu" />
              )}
            </div>

            {/* Custom Legend (Danh sách bên dưới để không bị cắt chữ) */}
            <div className="w-full space-y-3">
              {dashboardData?.topCourses?.map((course, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm group cursor-default"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor:
                          CHART_COLORS[idx % CHART_COLORS.length],
                      }}
                    ></span>
                    <span
                      className="text-slate-600 truncate group-hover:text-slate-900 transition-colors"
                      title={course.label}
                    >
                      {course.label}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-800 flex-shrink-0 pl-2">
                    {Number(course.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 3: BOTTOM ROW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800">
              Tăng trưởng người dùng
            </h3>
          </div>
          <div className="h-64">
            {userChartData.labels.length > 0 ? (
              <Bar data={userChartData} options={userChartOptions} />
            ) : (
              <EmptyState text="Chưa có dữ liệu người dùng" />
            )}
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800">
              Giao dịch mới nhất
            </h3>
            <button className="text-indigo-600 text-sm font-semibold hover:text-indigo-800 transition-colors">
              Xem tất cả
            </button>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold tracking-wide">
                <tr>
                  <th className="px-6 py-4">Học viên</th>
                  <th className="px-6 py-4">Khóa học</th>
                  <th className="px-6 py-4 text-right">Giá trị</th>
                  <th className="px-6 py-4 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {dashboardData?.recentTransactions?.length > 0 ? (
                  dashboardData.recentTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-700">
                        <div className="flex flex-col">
                          <span>{tx.studentEmail}</span>
                          <span className="text-xs text-slate-400 font-normal">
                            {new Date(tx.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 text-slate-600 max-w-[200px] truncate"
                        title={tx.courseTitle}
                      >
                        {tx.courseTitle}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-800">
                        {formatCurrency(tx.totalAmount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Thành công
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      Chưa có giao dịch nào gần đây.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component phụ
const KpiCard = ({ title, value, trend, trendUp, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow duration-300">
    <div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
        {title}
      </p>
      <h4 className="text-3xl font-extrabold text-slate-800">{value}</h4>
      <div className="flex items-center mt-2 gap-2">
        <span
          className={`flex items-center text-sm font-semibold ${
            trendUp ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          {trendUp ? "↑" : "↓"} {trend}
        </span>
        <span className="text-slate-400 text-xs">vs tháng trước</span>
      </div>
    </div>
    <div className={`p-3 rounded-xl ${color} bg-opacity-50`}>{icon}</div>
  </div>
);

const EmptyState = ({ text }) => (
  <div className="h-full w-full flex flex-col items-center justify-center text-slate-400">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 mb-2 opacity-50"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
    <p className="text-sm font-medium">{text}</p>
  </div>
);

export default AdminDashboard;
