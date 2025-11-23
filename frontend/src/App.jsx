import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CourseDetail from "./pages/CourseDetail";
import LoginPage from "./pages/LoginPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import MyCourses from "./pages/student/MyCourses";
import EditCoursePage from "./pages/teacher/EditCoursePage";
import SignupPage from "./pages/SignupPage";
import CourseLearningPage from "./pages/student/CourseLearningPage";
// Import các trang Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminRevenue from "./pages/admin/AdminRevenue";
import AdminUsers from "./pages/admin/AdminUsers";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-white">
          <Navbar />

          <main className="flex-grow w-full">
            <Routes>
              {/* --- PUBLIC ROUTES --- */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />

              {/* --- STUDENT ROUTES --- */}
              <Route path="/my-courses" element={<MyCourses />} />
              <Route path="/learn/:id" element={<CourseLearningPage />} />
              {/* --- TEACHER ROUTES --- */}
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route
                path="/teacher/course/:id/edit"
                element={<EditCoursePage />}
              />

              {/* --- ADMIN ROUTES --- */}
              <Route path="/admin" element={<AdminLayout />}>
                {/* Hiển thị Dashboard khi vào /admin hoặc /admin/dashboard */}
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />

                {/* Các chức năng quản lý */}
                <Route path="courses" element={<AdminCourses />} />
                <Route path="revenue" element={<AdminRevenue />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
              <div>
                <h3 className="font-bold text-lg mb-4">CourseMaster</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Về chúng tôi</li>
                  <li>Liên hệ</li>
                  <li>Cơ hội nghề nghiệp</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Hỗ trợ</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Cài đặt ứng dụng</li>
                  <li>Trợ giúp</li>
                </ul>
              </div>
              <div>
                <p className="text-gray-400">&copy; 2025 CourseMaster, Inc.</p>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
