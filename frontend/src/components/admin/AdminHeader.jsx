import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const AdminHeader = ({ title, subtitle }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      {/* Title Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>

      {/* User Section - Glass style card */}
      <div className="flex items-center gap-4 bg-white p-2 pl-4 pr-2 rounded-full shadow-sm border border-slate-200">
        <div className="text-right hidden md:block">
          <div className="text-sm font-bold text-slate-800 leading-none">
            {user?.fullName || "Admin User"}
          </div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase mt-1">
            Quản trị viên
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white">
          {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "A"}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
