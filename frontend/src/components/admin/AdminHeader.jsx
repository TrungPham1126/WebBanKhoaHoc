import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const AdminHeader = ({ title, subtitle }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      {/* Bên trái: Tiêu đề trang */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>

      {/* Bên phải: Thông tin Admin & Nút hành động nhanh */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden md:block">
          <div className="text-sm font-bold text-gray-900">
            {user?.fullName || "Administrator"}
          </div>
          <div className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded-full inline-block">
            System Admin
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {user?.fullName ? user.fullName.charAt(0) : "A"}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
