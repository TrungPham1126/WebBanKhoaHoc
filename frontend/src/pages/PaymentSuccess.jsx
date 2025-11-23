import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Tự động chuyển trang sau 3s
    const timer = setTimeout(() => {
      navigate("/my-courses");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Thanh toán thành công!
        </h1>
        <p className="text-gray-500 mb-6">
          Cảm ơn bạn đã mua khóa học. Hệ thống đang chuyển bạn đến trang khóa
          học của tôi...
        </p>
        <button
          onClick={() => navigate("/my-courses")}
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
        >
          Về trang khóa học
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
