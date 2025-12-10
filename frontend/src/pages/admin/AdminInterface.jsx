import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import AdminHeader from "../../components/admin/AdminHeader";

const AdminInterface = () => {
  const [banners, setBanners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    buttonText: "Bắt đầu học",
    buttonLink: "#courses",
    image: null,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await axiosClient.get("/banners");
      setBanners(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    data.append("buttonText", formData.buttonText);
    data.append("buttonLink", formData.buttonLink);
    if (formData.image) data.append("image", formData.image);

    try {
      await axiosClient.post("/banners", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsModalOpen(false);
      fetchBanners();
      // Reset form sau khi thêm
      setFormData({
        title: "",
        subtitle: "",
        buttonText: "Bắt đầu học",
        buttonLink: "#courses",
        image: null,
      });
      alert("Thêm banner thành công!");
    } catch (e) {
      alert("Lỗi khi thêm banner");
    }
  };

  const handleActivate = async (id) => {
    try {
      await axiosClient.put(`/banners/${id}/activate`);
      fetchBanners();
    } catch (e) {
      alert("Lỗi kích hoạt");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa banner này chứ?")) {
      try {
        await axiosClient.delete(`/banners/${id}`);
        fetchBanners();
      } catch (e) {
        alert("Lỗi xóa");
      }
    }
  };

  return (
    // THAY ĐỔI: Thêm padding và màu nền tổng thể xám nhẹ để nổi bật các card trắng
    <div className="space-y-8 p-6 bg-slate-50 min-h-screen">
      <AdminHeader
        title="Quản lý Giao diện"
        subtitle="Cấu hình Banner và các thành phần hiển thị trên trang chủ"
      />

      <div className="flex justify-between items-center">
        {/* THAY ĐỔI: Chữ đậm hơn và dùng màu Slate-800 thay vì gray-700 để nhìn nét hơn */}
        <h3 className="font-bold text-slate-800 text-xl">Danh sách Banner</h3>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 font-semibold shadow-md transition-all flex items-center gap-2"
        >
          <span>+</span> Thêm Banner mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {banners.map((banner) => (
          <div
            key={banner.id}
            // THAY ĐỔI: Thêm hiệu ứng hover shadow để card nổi lên khi rê chuột
            className={`relative group bg-white rounded-xl shadow-sm hover:shadow-lg border overflow-hidden transition-all duration-300 ${
              banner.isActive
                ? "border-emerald-500 ring-1 ring-emerald-500" // Đổi màu xanh lá tươi hơn
                : "border-gray-200"
            }`}
          >
            {/* Ảnh Banner */}
            <div className="h-48 overflow-hidden bg-gray-100 relative">
              <img
                src={`http://localhost:8080${banner.imageUrl}`}
                alt={banner.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/600x300?text=No+Image")
                }
              />
              {banner.isActive && (
                <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                  Đang hiển thị
                </div>
              )}
            </div>

            {/* Nội dung Card */}
            <div className="p-5">
              {/* THAY ĐỔI: Tiêu đề màu đen xám (slate-900) cho dễ đọc */}
              <h4 className="font-bold text-lg text-slate-900 mb-2 leading-tight">
                {banner.title}
              </h4>

              {/* THAY ĐỔI: Mô tả màu xám trung tính (slate-600) */}
              <p className="text-slate-600 text-sm mb-5 line-clamp-2 h-10">
                {banner.subtitle}
              </p>

              <div className="flex gap-3 border-t border-gray-100 pt-4 mt-auto">
                {!banner.isActive && (
                  <button
                    onClick={() => handleActivate(banner.id)}
                    className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg font-medium hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-sm"
                  >
                    Kích hoạt
                  </button>
                )}
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="flex-1 bg-rose-50 text-rose-600 py-2 rounded-lg font-medium hover:bg-rose-100 hover:text-rose-700 transition-colors text-sm"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Thêm Mới */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl transform transition-all scale-100">
            <h3 className="font-bold text-2xl mb-6 text-slate-800 border-b pb-2">
              Tạo Banner Mới
            </h3>

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Tiêu đề lớn <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  value={formData.title}
                  placeholder="Ví dụ: Khóa học Spring Boot..."
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Mô tả phụ <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  rows="3"
                  value={formData.subtitle}
                  placeholder="Mô tả ngắn gọn về chương trình..."
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Text nút bấm
                  </label>
                  <input
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.buttonText}
                    onChange={(e) =>
                      setFormData({ ...formData, buttonText: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Link nút bấm
                  </label>
                  <input
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.buttonLink}
                    onChange={(e) =>
                      setFormData({ ...formData, buttonLink: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Hình ảnh nền <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.files[0] })
                    }
                    required
                  />
                  <span className="text-slate-500 text-sm">
                    {formData.image
                      ? formData.image.name
                      : "Kéo thả hoặc click để chọn ảnh"}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-md hover:shadow-lg transition"
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

export default AdminInterface;
