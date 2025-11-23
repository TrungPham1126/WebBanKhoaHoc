import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axiosClient
      .get("/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Quản lý Người dùng
      </h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Họ tên</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Vai trò</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-500">#{user.id}</td>
                <td className="px-6 py-4 font-bold text-gray-900">
                  {user.fullName}
                </td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className={`px-2 py-1 rounded text-xs font-bold mr-1 
                      ${
                        role === "ROLE_ADMIN"
                          ? "bg-red-100 text-red-700"
                          : role === "ROLE_TEACHER"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {role.replace("ROLE_", "")}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
