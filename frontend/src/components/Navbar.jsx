import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [balance, setBalance] = useState(0);
  const [realProfile, setRealProfile] = useState({ fullName: "", avatar: "" });

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) navigate(`/?search=${encodeURIComponent(keyword)}`);
  };

  const isTeacher = user?.roles?.includes("ROLE_TEACHER");
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      // 1. Get User Info
      try {
        const userRes = await axiosClient.get(`/users/${user.id}`);
        const userData = userRes.data?.data || userRes.data;
        setRealProfile({
          fullName: userData.fullName || "",
          avatar: userData.avatar || "",
        });
      } catch (error) {
        // console.warn("User info fetch warning:", error);
      }

      // 2. Get Wallet (Teacher Only)
      if (isTeacher) {
        try {
          // Gọi đúng endpoint đã map ở backend: /api/v1/wallet/me
          const walletRes = await axiosClient.get("/wallet/me", {
            params: { userId: user.id },
          });
          const walletData = walletRes.data?.data || walletRes.data;
          setBalance(walletData?.balance || 0);
        } catch (error) {
          console.error("Lỗi lấy ví tiền:", error);
        }
      }
    };
    fetchData();
  }, [user, isTeacher]);

  const displayName =
    realProfile.fullName || user?.fullName || user?.email || "User";
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 h-[72px] flex items-center font-sans border-b border-gray-200">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="flex-shrink-0 text-2xl font-bold text-purple-600 tracking-tight hover:text-purple-700 transition"
        >
          English course
        </Link>
        <form
          onSubmit={handleSearch}
          className="flex-grow max-w-xl relative hidden md:block group mx-4"
        >
          <button
            type="submit"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600"
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
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            className="w-full bg-gray-50 border border-gray-300 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </form>
        <div className="flex items-center gap-5 flex-shrink-0">
          <Link
            to="/"
            className="hidden lg:block text-sm font-medium text-gray-700 hover:text-purple-600 transition"
          >
            Trang chủ
          </Link>
          {user ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-100"
                >
                  ⚡ Quản trị
                </Link>
              )}
              {!isAdmin && (
                <Link
                  to="/my-courses"
                  className="text-sm font-medium text-gray-700 hover:text-purple-600 transition"
                >
                  Khóa học của tôi
                </Link>
              )}
              {isTeacher && !isAdmin && (
                <Link
                  to="/teacher/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-purple-600 transition"
                >
                  Quản lý khóa học
                </Link>
              )}
              {!isTeacher && !isAdmin && (
                <Link
                  to="/become-teacher"
                  className="text-sm font-medium text-gray-700 hover:text-purple-600 transition"
                >
                  Trở thành giáo viên
                </Link>
              )}

              <div className="flex items-center gap-2 ml-2 relative group cursor-pointer h-full">
                <span className="text-sm font-bold text-gray-800 max-w-[150px] truncate hidden sm:block">
                  {displayName}
                </span>
                <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg border-2 border-purple-100 overflow-hidden">
                  {realProfile.avatar ? (
                    <img
                      src={realProfile.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    firstLetter
                  )}
                </div>
                <div className="absolute right-0 top-full pt-3 w-64 hidden group-hover:block z-50 animate-fadeIn">
                  <div className="bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Tài khoản
                      </p>
                      <p
                        className="text-sm text-gray-800 font-medium truncate"
                        title={user.email}
                      >
                        {user.email}
                      </p>
                      {isTeacher && (
                        <div className="mt-2 flex items-center justify-between bg-green-50 px-3 py-2 rounded border border-green-100">
                          <span className="text-xs text-green-700 font-bold">
                            Số dư:
                          </span>
                          <span className="text-sm font-bold text-green-700">
                            {formatCurrency(balance)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="py-1">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Trang quản trị
                        </Link>
                      )}
                      {isTeacher && (
                        <Link
                          to="/teacher/wallet"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Quản lý Ví tiền
                        </Link>
                      )}
                      <Link
                        to="/my-courses"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Khóa học của tôi
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          navigate("/login");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex gap-3 ml-4">
              <Link
                to="/login"
                className="text-sm font-bold text-gray-700 hover:text-purple-600 px-3 py-2 border border-gray-300 rounded-md"
              >
                Đăng nhập
              </Link>
              <Link
                to="/signup"
                className="text-sm font-bold text-white bg-gray-900 px-3 py-2 border border-gray-900 rounded-md"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
