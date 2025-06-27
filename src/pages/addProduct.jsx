import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import Header from '../components/header';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    quantity: '',
    properties: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    
    <div className="flex flex-row-reverse h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col max-h-screen ">

        <div className=" text-right w-full bg-white shadow-sm">
          <Header />
        </div>

        
        <div className="flex-1 bg-[#F6F7FB] p-8 flex justify-end items-start pr-8">
          <form className="w-full max-w-xl space-y-6">

            <div className="grid grid-cols-2 gap-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border px-4 py-2 rounded text-right bg-white"
                placeholder="اسم المنتج"
              />
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border px-4 py-2 rounded text-right bg-white"
                placeholder="الصنف"
              />
            </div>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded text-right h-28 bg-white"
              placeholder="وصف المنتج"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="border px-4 py-2 rounded text-right bg-white"
                placeholder="سعر البيع"
              />
              <input
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="border px-4 py-2 rounded text-right bg-white"
                placeholder="الكمية"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-right">الخصائص</label>
              <textarea
                name="properties"
                value={formData.properties}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded text-right h-24 bg-white"
                placeholder={`"اللون" : "أضف اللون"\n"الحجم" : "أضف الحجم"\n"الوزن" : "أضف الوزن"`}
              />
            </div>

            <div className="flex flex-col items-end">
              <label className="mb-2">
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="hidden"
                />
                <button
                  type="button"
                  className="px-6 py-2 rounded bg-blue-300 hover:bg-blue-200"
                >
                  تحميل صورة من جهازك
                </button>
              </label>

              <div className="flex flex-row-reverse items-end justify-between gap-4">

  {/* الصورة */}
  <div className="w-40 h-40 border rounded flex items-center justify-center bg-gray-100">
    {formData.image ? (
      <img
        src={URL.createObjectURL(formData.image)}
        alt="Preview"
        className="max-h-full max-w-full object-contain"
      />
    ) : (
      <span className="text-gray-400">📷</span>
    )}
  </div>

 
  <button
    type="submit"
    className="px-6 py-2 bg-blue-300 hover:bg-blue-200 rounded"
  >
    إضافة المنتج
  </button>
</div>
</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
