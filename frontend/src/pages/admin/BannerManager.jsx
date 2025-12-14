import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import AdminHeader from "../../components/admin/AdminHeader";

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    buttonText: "Bắt đầu học",
    buttonLink: "#courses",
    image: null,
  });

  // URL backend để hiển thị ảnh (Thay đổi port nếu cần)
  const API_URL = "http://localhost:8080";

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      // Gọi API: GET /api/v1/banners
      const res = await axiosClient.get("/banners");
      setBanners(res.data);
    } catch (e) {
      console.error("Lỗi tải banners:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    // Sử dụng FormData để gửi file upload
    const data = new FormData();
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    data.append("buttonText", formData.buttonText);
    data.append("buttonLink", formData.buttonLink);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      await axiosClient.post("/banners", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Reset form & reload
      setIsModalOpen(false);
      fetchBanners();
      setFormData({
        title: "",
        subtitle: "",
        buttonText: "Bắt đầu học",
        buttonLink: "#courses",
        image: null,
      });
      alert("Thêm banner thành công!");
    } catch (e) {
      console.error(e);
      alert("Lỗi khi thêm banner. Vui lòng thử lại.");
    }
  };

  const handleAction = async (id, action) => {
    if (
      action === "delete" &&
      !window.confirm("Bạn có chắc chắn muốn xóa banner này?")
    )
      return;

    try {
      if (action === "delete") {
        await axiosClient.delete(`/banners/${id}`);
      } else if (action === "activate") {
        await axiosClient.put(`/banners/${id}/activate`);
      } else if (action === "deactivate") {
        // Nếu backend có API ẩn banner
        await axiosClient.put(`/banners/${id}/deactivate`);
      }
      fetchBanners();
    } catch (e) {
      alert("Có lỗi xảy ra khi cập nhật banner.");
    }
  };

  // --- UI COMPONENTS ---

  if (isLoading)
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <AdminHeader
        title="Quản lý Banner"
        subtitle="Cài đặt các banner quảng cáo hiển thị trên trang chủ."
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 pb-6">
        <div>
          <h3 className="font-bold text-slate-800 text-xl">
            Danh sách Banner{" "}
            <span className="text-slate-400 font-normal">
              ({banners.length})
            </span>
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý hiển thị slider trang chủ
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 font-semibold shadow-lg shadow-indigo-200 transition-all text-sm flex items-center gap-2 active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Thêm banner mới
        </button>
      </div>

      {/* Empty State */}
      {banners.length === 0 && !isLoading && (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500">Chưa có banner nào. Hãy thêm mới!</p>
        </div>
      )}

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl border transition-all duration-300 flex flex-col overflow-hidden relative ${
              banner.isActive
                ? "border-emerald-500 ring-1 ring-emerald-500"
                : "border-slate-200"
            }`}
          >
            {/* Status Badge */}
            <div
              className={`absolute top-3 right-3 z-10 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                banner.isActive
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-500 text-white"
              }`}
            >
              {banner.isActive ? "Đang hiện" : "Đã ẩn"}
            </div>

            {/* Image Area */}
            <div className="h-48 relative overflow-hidden bg-slate-100 group">
              <img
                // Nếu URL từ backend chưa có http thì thêm vào, nếu có rồi thì giữ nguyên
                src={
                  banner.imageUrl
                    ? banner.imageUrl.startsWith("http")
                      ? banner.imageUrl
                      : `${API_URL}${banner.imageUrl}`
                    : ""
                }
                alt={banner.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/600x300?text=No+Image")
                }
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>

            {/* Content Area */}
            <div className="p-5 flex flex-col flex-1">
              <h4
                className="font-bold text-lg text-slate-800 mb-1 line-clamp-1"
                title={banner.title}
              >
                {banner.title}
              </h4>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
                {banner.subtitle || "Không có mô tả"}
              </p>

              <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                <button
                  onClick={() =>
                    handleAction(
                      banner.id,
                      banner.isActive ? "deactivate" : "activate"
                    )
                  }
                  className={`py-2 rounded-lg text-sm font-semibold transition ${
                    banner.isActive
                      ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  }`}
                >
                  {banner.isActive ? "Ẩn đi" : "Hiện lên"}
                </button>
                <button
                  onClick={() => handleAction(banner.id, "delete")}
                  className="py-2 rounded-lg bg-rose-50 text-rose-600 text-sm font-semibold hover:bg-rose-100 transition"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl animate-scale-up">
            <h3 className="font-bold text-2xl mb-6 text-slate-800">
              Tạo Banner Mới
            </h3>

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tiêu đề lớn
                </label>
                <input
                  className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="Ví dụ: Khóa học Spring Boot"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mô tả phụ
                </label>
                <textarea
                  className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  rows="3"
                  placeholder="Mô tả ngắn gọn về chương trình..."
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Text nút bấm
                  </label>
                  <input
                    className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.buttonText}
                    onChange={(e) =>
                      setFormData({ ...formData, buttonText: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Link đích
                  </label>
                  <input
                    className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.buttonLink}
                    onChange={(e) =>
                      setFormData({ ...formData, buttonLink: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Hình ảnh banner
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 hover:bg-slate-50 transition text-center cursor-pointer relative">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.files[0] })
                    }
                    accept="image/*"
                    required
                  />
                  <div className="text-slate-500 text-sm">
                    {formData.image ? (
                      <span className="text-indigo-600 font-semibold">
                        {formData.image.name}
                      </span>
                    ) : (
                      <span>Kéo thả hoặc click để chọn ảnh</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-bold shadow-lg shadow-indigo-200 transition"
                >
                  Lưu Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManager;
