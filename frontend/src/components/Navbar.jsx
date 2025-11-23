import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?search=${encodeURIComponent(keyword)}`);
    }
  };

  // Kiểm tra quyền
  const isTeacher = user?.roles?.includes("ROLE_TEACHER");
  const isAdmin = user?.roles?.includes("ROLE_ADMIN"); // <--- THÊM DÒNG NÀY

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 h-[72px] flex items-center font-sans border-b border-gray-200">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* 1. LOGO */}
        <Link
          to="/"
          className="flex-shrink-0 text-2xl font-bold text-purple-600 tracking-tight hover:text-purple-700 transition"
        >
          English course
        </Link>

        {/* 2. SEARCH BAR */}
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

        {/* 3. MENU CẤP 1 */}
        <div className="flex items-center gap-5 flex-shrink-0">
          <Link
            to="/"
            className="hidden lg:block text-sm font-medium text-gray-700 hover:text-purple-600 transition"
          >
            Trang chủ
          </Link>

          {/* LOGIC ĐĂNG NHẬP */}
          {user ? (
            <>
              {/* --- PHẦN MENU ADMIN (Chỉ hiện khi là Admin) --- */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 px-3 py-2 rounded-lg transition border border-red-100"
                >
                  ⚡ Quản trị hệ thống
                </Link>
              )}
              {/* ----------------------------------------------- */}

              {!isAdmin && (
                <Link
                  to="/my-courses"
                  className="text-sm font-medium text-gray-700 hover:text-purple-600 transition"
                >
                  Khóa học của tôi
                </Link>
              )}

              {/* Menu cho Giáo viên */}
              {isTeacher && !isAdmin && (
                <Link
                  to="/teacher/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-purple-600 transition"
                >
                  Quản lý khóa học
                </Link>
              )}

              {/* Menu cho Học sinh (chưa phải GV và ko phải Admin) */}
              {!isTeacher && !isAdmin && (
                <Link
                  to="/teach"
                  className="text-sm font-medium text-gray-700 hover:text-purple-600 transition"
                >
                  Trở thành giáo viên
                </Link>
              )}

              {/* User Avatar & Dropdown */}
              <div className="flex items-center gap-2 ml-2 relative group cursor-pointer h-full">
                <span className="text-sm font-bold text-gray-800 max-w-[150px] truncate hidden sm:block">
                  {user.fullName || user.email}
                </span>

                <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg border-2 border-purple-100">
                  {user.fullName
                    ? user.fullName.charAt(0).toUpperCase()
                    : user.email.charAt(0).toUpperCase()}
                </div>

                {/* --- SỬA LẠI PHẦN DROPDOWN --- */}
                {/* 1. Thẻ bao ngoài dùng pt-3 để tạo cầu nối vô hình (Invisible Bridge) */}
                <div className="absolute right-0 top-full pt-3 w-48 hidden group-hover:block z-50 animate-fadeIn">
                  
                  {/* 2. Phần giao diện thực tế nằm bên trong */}
                  <div className="bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden">
                    
                    {/* Header nhỏ hiển thị email */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tài khoản</p>
                      <p className="text-sm text-gray-800 font-medium truncate" title={user.email}>
                        {user.email}
                      </p>
                    </div>

                    <div className="py-1">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        >
                          <span className="material-icons-outlined text-lg">admin_panel_settings</span>
                          Trang quản trị
                        </Link>
                      )}
                      
                      {/* Thêm link về trang cá nhân nếu cần */}
                      <Link
                        to="/my-courses"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                      >
                         <span className="material-icons-outlined text-lg">school</span>
                         Khóa học của tôi
                      </Link>

                      <button
                        onClick={logout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                      >
                        <span className="material-icons-outlined text-lg">logout</span>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
                {/* ----------------------------- */}
              </div>
            </>
          ) : (
            <div className="flex gap-3 ml-4">
              <Link
                to="/login"
                className="text-sm font-bold text-gray-700 hover:text-purple-600 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                Đăng nhập
              </Link>
              <Link
                to="/signup"
                className="text-sm font-bold text-white bg-gray-900 px-3 py-2 border border-gray-900 rounded-md hover:bg-gray-800 transition"
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
