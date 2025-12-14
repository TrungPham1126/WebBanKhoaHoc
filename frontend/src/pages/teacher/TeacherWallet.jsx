import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";

const TeacherWallet = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState({ balance: 0 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankInfo, setBankInfo] = useState("");

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);

      // 🔥 FIX: GỌI API KHÔNG CẦN TRUYỀN userId QUA QUERY PARAM
      // Backend Payment Service NÊN tự động lấy userId từ JWT Token
      const [resWallet, resHistory] = await Promise.all([
        axiosClient.get("/wallet/me"),
        axiosClient.get("/wallet/history"),
      ]);

      // Xử lý response từ Backend (giả định Backend trả về cấu trúc RestResponse)
      const walletData = resWallet.data?.data || resWallet.data;
      const historyData = resHistory.data?.data || resHistory.data;

      if (walletData) setWallet(walletData);
      if (historyData) setHistory(historyData);
    } catch (error) {
      console.error("Lỗi tải dữ liệu ví:", error);
      // Có thể thêm cảnh báo người dùng nếu lỗi
      // alert("Không thể tải thông tin ví. Vui lòng kiểm tra lại JWT hoặc Backend Payment Service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Chỉ fetch khi user đã load xong và có ID
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!user?.id) return alert("Lỗi: Không tìm thấy ID người dùng.");

    if (!withdrawAmount || !bankInfo)
      return alert("Vui lòng nhập đủ thông tin!");
    if (Number(withdrawAmount) > wallet.balance)
      return alert("Số dư không đủ!");
    if (Number(withdrawAmount) < 50000) return alert("Tối thiểu rút 50.000đ");

    try {
      // 🔥 FIX: GỌI API KHÔNG CẦN TRUYỀN userId QUA QUERY PARAM
      // Backend Payment Service NÊN tự động lấy userId từ JWT Token
      const res = await axiosClient.post("/wallet/withdraw", null, {
        params: {
          amount: withdrawAmount,
          bankInfo: bankInfo,
        },
      });

      if (res.data.statusCode === 200) {
        alert("Gửi yêu cầu thành công!");
        setIsModalOpen(false);
        setWithdrawAmount("");
        setBankInfo("");
        fetchData(); // Tải lại dữ liệu
      } else {
        alert(res.data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || "Lỗi kết nối Server"));
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Đang tải...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 min-h-screen bg-gray-50">
      {/* Header và Số dư */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ví Giảng Viên</h1>
          <p className="text-gray-500 text-sm mt-1">
            Quản lý dòng tiền của bạn.
          </p>
        </div>
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl min-w-[320px] shadow-lg">
          <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-2">
            Số dư khả dụng
          </p>
          <div className="flex justify-between items-end">
            <span className="text-3xl font-extrabold">
              {formatCurrency(wallet.balance)}
            </span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-semibold transition backdrop-blur-md"
            >
              Rút tiền
            </button>
          </div>
        </div>
      </div>

      {/* Lịch sử giao dịch */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/30">
          <h3 className="font-bold text-gray-800">Lịch sử biến động</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3">Thời gian</th>
                <th className="px-6 py-3">Loại</th>
                <th className="px-6 py-3 text-right">Số tiền</th>
                <th className="px-6 py-3">Nội dung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.length > 0 ? (
                history.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(tx.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          tx.type === "INCOME"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {tx.type === "INCOME" ? "Thu nhập" : "Rút tiền"}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 font-bold text-right ${
                        tx.amount > 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {formatCurrency(tx.amount)}
                    </td>
                    <td
                      className="px-6 py-4 text-gray-600 max-w-sm truncate"
                      title={tx.description}
                    >
                      {tx.description}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-gray-400"
                  >
                    Chưa có giao dịch.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal rút tiền */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                Yêu cầu rút tiền
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleWithdraw} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số tiền (VNĐ)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full p-3 pl-4 pr-12 border border-gray-300 rounded-xl text-gray-900 font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition placeholder-gray-400"
                    placeholder="VD: 1000000"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    min="50000"
                    required
                  />
                  <span className="absolute right-4 top-3.5 text-gray-400 font-bold text-sm">
                    VNĐ
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Khả dụng: {formatCurrency(wallet.balance)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thông tin ngân hàng
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm placeholder-gray-400"
                  rows="3"
                  placeholder="VD: Vietcombank - 0123456789 - NGUYEN VAN A"
                  value={bankInfo}
                  onChange={(e) => setBankInfo(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg transition"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default TeacherWallet;
