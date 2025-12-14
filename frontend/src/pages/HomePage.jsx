import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    // 1. Lấy khóa học
    axiosClient.get("/courses").then((res) => {
      const courseData = res && res.data ? res.data : res;
      if (Array.isArray(courseData)) setCourses(courseData);
    });

    // 2. Lấy Banner active
    axiosClient
      .get("/banners/active")
      .then((res) => {
        if (res.data) setBanner(res.data);
      })
      .catch((err) => console.log("Chưa có banner active"));
  }, []);

  const getImageUrl = (url) => {
    if (!url)
      return "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800";
    if (url.startsWith("http")) return url;
    return `http://localhost:8080${url}`;
  };

  return (
    <div className="w-full font-sans">
      {/* --- BANNER QUẢNG CÁO --- */}
      <div className="relative w-full h-[500px] bg-gray-900 flex justify-center items-center overflow-hidden">
        <img
          src={
            banner
              ? getImageUrl(banner.imageUrl)
              : "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop"
          }
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          alt="Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fadeIn">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            {banner ? banner.title : "Chinh phục Tiếng Anh"}
          </h2>
          <p className="text-gray-200 text-lg md:text-xl mb-8 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
            {banner
              ? banner.subtitle
              : "Mở rộng cơ hội nghề nghiệp và kết nối thế giới. Luyện thi IELTS, TOEIC và Giao tiếp cùng các chuyên gia hàng đầu."}
          </p>
          <div className="flex justify-center gap-4">
            <a
              href={banner ? banner.buttonLink : "#courses"}
              className="bg-purple-600 text-white font-bold py-3 px-8 rounded-full hover:bg-purple-700 transition transform hover:scale-105 shadow-lg shadow-purple-500/30"
            >
              {banner ? banner.buttonText : "Bắt đầu học ngay"}
            </a>
            {!banner && (
              <Link
                to="/signup"
                className="bg-white/10 backdrop-blur-md text-white border border-white/30 font-bold py-3 px-8 rounded-full hover:bg-white/20 transition"
              >
                Tạo tài khoản
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* --- DANH SÁCH KHÓA HỌC --- */}
      <div id="courses" className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Các khóa học nổi bật
            </h2>
            <p className="text-gray-500 mt-2">
              Được nhiều học viên lựa chọn nhất tháng này
            </p>
          </div>
          <Link
            to="/courses"
            className="text-purple-600 font-bold hover:underline hidden sm:block"
          >
            Xem tất cả →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {courses.map((course) => (
            <Link
              to={`/course/${course.id}`}
              key={course.id}
              className="group cursor-pointer block h-full"
            >
              <div className="w-full h-full flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-full h-48 overflow-hidden relative">
                  <img
                    src={getImageUrl(course.imageUrl)}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300";
                    }}
                  />
                  {/* 🔥 HIỂN THỊ SỐ LƯỢNG HỌC VIÊN THẬT */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-gray-800 shadow-sm flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-indigo-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    {course.studentCount || 0} học viên
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-purple-700 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-500 truncate mb-4 flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-gray-200 inline-block"></span>
                    {course.teacherName || "Giảng viên uy tín"}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="font-bold text-xl text-purple-600">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(course.price)}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
