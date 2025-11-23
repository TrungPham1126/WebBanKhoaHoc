import { useState, useEffect } from "react";

const CourseModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);

  // Khi mở modal, nếu có initialData (Sửa) thì điền vào form, nếu không (Thêm) thì reset
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        price: initialData.price,
        image: null, // Không set file cũ vào input file được
      });
      // Hiển thị ảnh cũ
      setPreview(
        initialData.imageUrl
          ? `http://localhost:8080${initialData.imageUrl}`
          : null
      );
    } else {
      setFormData({ title: "", description: "", price: "", image: null });
      setPreview(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gửi dữ liệu ra ngoài cho Dashboard xử lý
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {initialData ? "Cập nhật khóa học" : "Thêm khóa học mới"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên khóa học */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên khóa học
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Giá */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Giá (VNĐ)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
            ></textarea>
          </div>

          {/* Ảnh thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ảnh bìa
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 h-32 w-full object-cover rounded-md border"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700"
            >
              {initialData ? "Lưu thay đổi" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;
