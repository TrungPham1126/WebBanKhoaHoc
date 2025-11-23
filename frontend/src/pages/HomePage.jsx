import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const HomePage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axiosClient
      .get("/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Lỗi API:", err));
  }, []);

  return (
    <div className="w-full font-sans">
      {/* --- 1. BANNER QUẢNG CÁO (ĐÃ SỬA THEO CHỦ ĐỀ TIẾNG ANH) --- */}
      <div className="relative w-full h-[450px] bg-gray-100 flex justify-center items-center overflow-hidden">
        {/* Ảnh nền: Chọn ảnh liên quan đến học tập, giao tiếp hoặc du lịch (London/US) */}
        <img
          src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover"
          alt="English Learning Banner"
        />

        {/* Lớp phủ màu tối nhẹ để chữ nổi bật hơn nếu ảnh quá sáng */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Hộp nội dung */}
        <div className="relative z-10 bg-white p-8 shadow-2xl max-w-lg rounded-lg ml-6 md:ml-20 self-center md:self-auto md:mt-16 animate-fadeIn">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
            Chinh phục Tiếng Anh
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            Mở rộng cơ hội nghề nghiệp và kết nối thế giới. Luyện thi IELTS,
            TOEIC và Giao tiếp cùng các chuyên gia hàng đầu.
          </p>
          <div className="flex gap-3">
            <a
              href="#courses"
              className="bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 transition"
            >
              Bắt đầu học
            </a>
            <a
              href="/practice"
              className="border border-purple-600 text-purple-600 font-bold py-2 px-4 rounded hover:bg-purple-50 transition"
            >
              Luyện tập
            </a>
          </div>
        </div>
      </div>

      {/* --- 2. DANH SÁCH KHÓA HỌC --- */}
      <div id="courses" className="max-w-7xl mx-auto px-6 py-12 w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Các khóa học nổi bật
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          Lựa chọn từ hàng ngàn khóa học video online chất lượng cao
        </p>

        {/* Thông báo nếu chưa có khóa học */}
        {courses.length === 0 && (
          <div className="text-center text-gray-500 py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-4xl mb-3">📚</div>
            <p className="text-xl font-medium">
              Chưa có khóa học nào được đăng.
            </p>
            <p className="text-sm mt-2 text-gray-400">
              Các khóa học mới sẽ sớm được cập nhật.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <Link
              to={`/course/${course.id}`}
              key={course.id}
              className="group cursor-pointer block h-full"
            >
              <div className="w-full h-full flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="w-full h-40 overflow-hidden relative">
                  <img
                    src={
                      course.imageUrl
                        ? `http://localhost:8080${course.imageUrl}`
                        : "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800" // Ảnh placeholder đẹp hơn
                    }
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge giảm giá hoặc tag nếu có */}
                  <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded text-gray-800 shadow">
                    Bán chạy
                  </div>
                </div>

                <div className="p-3 flex flex-col flex-grow">
                  <h3 className="font-bold text-base text-gray-900 line-clamp-2 group-hover:text-purple-700 mb-1 min-h-[3rem]">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-500 truncate mb-2">
                    {course.teacherName || "Giảng viên uy tín"}
                  </p>

                  <div className="flex items-center gap-1 mb-2">
                    <span className="font-bold text-sm text-amber-700">
                      4.8
                    </span>
                    <div className="flex text-yellow-500 text-xs">
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                    </div>
                    <span className="text-xs text-gray-400 ml-1">(2,840)</span>
                  </div>

                  <div className="mt-auto flex items-center gap-2">
                    <div className="font-bold text-lg text-gray-900">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(course.price)}
                    </div>
                    {/* Giá cũ giả lập để trông hấp dẫn hơn */}
                    <div className="text-sm text-gray-400 line-through">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(course.price * 1.5)}
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
