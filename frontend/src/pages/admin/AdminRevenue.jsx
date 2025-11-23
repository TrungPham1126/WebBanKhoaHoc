import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

const AdminRevenue = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ total: 0, adminShare: 0 });

  useEffect(() => {
    // Gọi API lấy lịch sử giao dịch từ Payment Service
    axiosClient
      .get("/payments/history")
      .then((res) => {
        setTransactions(res.data);

        // Tính toán tổng doanh thu
        // Lưu ý: Backend trả về trường "totalAmount" chứ không phải "amount"
        const total = res.data.reduce(
          (acc, curr) => acc + (curr.totalAmount || 0),
          0
        );

        // Giả sử Admin nhận 40% hoa hồng
        setStats({ total, adminShare: total * 0.4 });
      })
      .catch((err) => console.error("Lỗi tải doanh thu:", err));
  }, []);

  // Hàm format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Báo cáo Doanh thu
      </h1>

      {/* Cards Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm font-medium">
            Tổng doanh thu hệ thống
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(stats.total)}
          </p>
        </div>
        <div className="bg-purple-50 p-6 rounded-xl shadow-sm border border-purple-100">
          <p className="text-purple-600 text-sm font-medium">
            Lợi nhuận Admin (40%)
          </p>
          <p className="text-3xl font-bold text-purple-800 mt-2">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(stats.adminShare)}
          </p>
        </div>
      </div>

      {/* Bảng giao dịch */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-800">Giao dịch gần đây</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3">Mã GD</th>
                <th className="px-6 py-3">Người mua</th>
                <th className="px-6 py-3">Khóa học</th>
                <th className="px-6 py-3">Số tiền</th>
                <th className="px-6 py-3">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.length > 0 ? (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {t.transactionId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {t.studentEmail}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {t.courseTitle}
                    </td>
                    <td className="px-6 py-4 font-bold text-green-600">
                      +
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(t.totalAmount)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {formatDate(t.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Chưa có giao dịch nào.
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

export default AdminRevenue;
