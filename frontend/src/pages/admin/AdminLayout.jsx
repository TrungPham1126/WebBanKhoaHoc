import { Link, Outlet, useLocation } from "react-router-dom";
// 1. IMPORT NAVBAR TRANG CHỦ
// (Hãy đảm bảo đường dẫn này đúng với dự án của bạn)
import Navbar from "../../components/Navbar";

// --- ĐỊNH NGHĨA ICONS VÀ MENU ITEMS (Giữ nguyên như cũ) ---
const icons = {
  dashboard: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25a2.25 2.25 0 0 1-2.25 2.25h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z"
      />
    </svg>
  ),
  courses: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12 10.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12 14.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12 18a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 7.5a3 3 0 0 0-3-3h-9a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3v-9Z"
      />
    </svg>
  ),
  users: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  ),
  revenue: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 18.75V3.75a4.5 4.5 0 0 1 4.5-4.5h11.25a4.5 4.5 0 0 1 4.5 4.5v15a4.5 4.5 0 0 1-4.5 4.5H6.75a4.5 4.5 0 0 1-4.5-4.5Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 10.5h7.5" />
    </svg>
  ),
  banners: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
  ),
};

const menuItems = [
  { label: "Tổng quan", icon: icons.dashboard, path: "/admin/dashboard" },
  { label: "Khóa học", icon: icons.courses, path: "/admin/courses" },
  { label: "Người dùng", icon: icons.users, path: "/admin/users" },
  { label: "Quản lý Banner", icon: icons.banners, path: "/admin/banners" },
  { label: "Doanh thu", icon: icons.revenue, path: "/admin/revenue" },
];
// ---------------------------------------------------------

const AdminLayout = () => {
  const location = useLocation();

  return (
    // 2. THAY ĐỔI LAYOUT CHÍNH: flex-col để xếp chồng theo chiều dọc
    <div className="flex flex-col h-screen bg-slate-50 font-inter overflow-hidden">
      {/* 3. ĐẶT NAVBAR TRANG CHỦ Ở TRÊN CÙNG */}
      <div className="z-30 shadow-sm relative">
        <Navbar />
      </div>

      {/* 4. KHU VỰC BÊN DƯỚI: Chứa Sidebar và Main Content ngang nhau */}
      <div className="flex flex-1 overflow-hidden relative z-20">
        {/* Sidebar - Fixed (Giữ nguyên logic cũ) */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col transition-all duration-300">
          {/* <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              AdminPortal
            </span>
          </div> */}
          {/* (Tùy chọn: Bạn có thể bỏ phần Logo "AdminPortal" ở đây đi vì trên Navbar đã có logo rồi) */}

          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Menu
            </p>
            {menuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium
                    ${
                      isActive
                        ? "bg-purple-50 text-purple-700 shadow-sm ring-1 ring-purple-100"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <span
                    className={`${
                      isActive
                        ? "text-purple-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    } transition-colors`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <Link
              to="/"
              className="flex items-center gap-3 text-slate-600 hover:text-purple-600 transition-colors text-sm font-medium px-2 py-2 rounded-md hover:bg-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                />
              </svg>
              Về trang chủ
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative bg-slate-50">
          <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
            <div className="w-full h-full">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
