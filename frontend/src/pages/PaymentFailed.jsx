import { useSearchParams, Link } from "react-router-dom";

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  // 🔥 SỬA LỖI: Đổi từ 'error' sang 'code' để khớp với Backend
  const code = searchParams.get("code");

  let errorMessage = "Giao dịch đã bị hủy hoặc gặp lỗi trong quá trình xử lý.";

  if (code === "enrollment_failed") {
    errorMessage =
      "Thanh toán đã trừ tiền nhưng kích hoạt khóa học gặp lỗi. Vui lòng liên hệ Admin.";
  } else if (code === "vnpay_failed") {
    errorMessage =
      "Giao dịch VNPAY thất bại. Vui lòng kiểm tra lại thông tin thanh toán hoặc thử lại.";
  }
  // Nếu code là null (ví dụ: /payment-failed), sẽ dùng errorMessage mặc định.

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        {/* Icon thất bại */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Thanh toán thất bại!
        </h2>

        <p className="text-gray-600 mb-6">{errorMessage}</p>

        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
          >
            Về trang chủ
          </Link>
          <a
            href="mailto:support@coursemaster.com"
            className="text-sm text-gray-500 hover:underline"
          >
            Liên hệ hỗ trợ ngay
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
