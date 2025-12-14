import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CourseDetail from "./pages/CourseDetail";
import LoginPage from "./pages/LoginPage";
import PaymentSuccess from "./pages/PaymentSuccess";

// 🔥 IMPORT MỚI: Trang Lỗi Thanh Toán
import PaymentFailed from "./pages/PaymentFailed";

import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import MyCourses from "./pages/student/MyCourses";
import EditCoursePage from "./pages/teacher/EditCoursePage";
import SignupPage from "./pages/SignupPage";
import CourseLearningPage from "./pages/student/CourseLearningPage";
import BecomeTeacherPage from "./pages/BecomeTeacherPage";
// Teacher Pages
import TeacherWallet from "./pages/teacher/TeacherWallet";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminRevenue from "./pages/admin/AdminRevenue";
import AdminUsers from "./pages/admin/AdminUsers";
import BannerManager from "./pages/admin/BannerManager";

// Layout chính
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-400">
          &copy; 2025 CourseMaster, Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 🟢 NHÓM 1: PUBLIC / STUDENT / TEACHER (Dùng Layout Chung) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            {/* ROUTE THANH TOÁN */}
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failed" element={<PaymentFailed />} />
            {/* Student Routes */}
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/become-teacher" element={<BecomeTeacherPage />} />
            {/* ❌ ĐÃ XÓA ROUTE /learn/:id Ở ĐÂY */}
            {/* Teacher Routes */}
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route
              path="/teacher/course/:id/edit"
              element={<EditCoursePage />}
            />
            {/* ROUTE VÍ TIỀN */}
            <Route path="/teacher/wallet" element={<TeacherWallet />} />
          </Route>

          {/* 🟢 NHÓM 2: TRANG HỌC (Full màn hình, KHÔNG dùng MainLayout) */}
          {/* 🔥 ĐƯỢC TÁCH RIÊNG RA ĐÂY */}
          <Route path="/learn/:id" element={<CourseLearningPage />} />

          {/* 🟢 NHÓM 3: ADMIN */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="revenue" element={<AdminRevenue />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="banners" element={<BannerManager />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
