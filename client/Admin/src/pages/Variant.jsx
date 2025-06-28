import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar';
import Header from '../components/header';

const Variant = () => {
  const [formData, setFormData] = useState({
    category_name: '',
    product_id: '',
    product_price: '',
    product_quantity: '',
  });

  const [attributes, setAttributes] = useState({});
  const [newAttr, setNewAttr] = useState({ key: '', value: '' });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const categoryAttributes = {
    "طيور": ["اللون"],
    "أعشاش": ["النوع"],
    "أقفاص": ["النوع", "الحجم", "عدد المآكل", "اللون"],
    "أعلاف": ["الوزن"],
    "مستلزمات أخرى": ["الحجم", "الوزن", "النوع", "اللون", "الكمية", "السعة"],
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/allCategories");
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'category_name') {
      const keys = categoryAttributes[value] || [];
      const initialAttrs = {};
      keys.forEach((k) => (initialAttrs[k] = ""));
      setAttributes(initialAttrs);

      try {
        const res = await axios.get(`http://localhost:5000/api/products-by-category/${value}`);
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
        setProducts([]);
      }
    }
  };

  const handleAttrChange = (key, value) => {
    setAttributes((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddNewAttr = () => {
    if (newAttr.key && newAttr.value) {
      setAttributes((prev) => ({ ...prev, [newAttr.key]: newAttr.value }));
      setNewAttr({ key: '', value: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.product_id) {
      alert("يرجى اختيار منتج");
      return;
    }
    if (!formData.category_name) {
      alert("يرجى اختيار صنف");
      return;
    }
    if (Number(formData.product_price) <= 0 || Number(formData.product_quantity) <= 0) {
      alert("الكمية وسعر البيع يجب أن تكون أرقام أكبر من صفر");
      return;
    }

    const finalAttributes = Object.keys(attributes).length ? attributes : null;

    const data = {
      product_id: formData.product_id,
      category_name: formData.category_name,
      product_price: formData.product_price,
      product_quantity: formData.product_quantity,
      attributes: finalAttributes,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/add-variant", data);
      console.log("تم الحفظ بنجاح:", res.data);
      alert("تم إضافة الخصائص بنجاح");
    } catch (error) {
      console.error("فشل إرسال البيانات:", error);
      alert("حدث خطأ أثناء الإضافة");
    }
  };

  return (
    <div className="flex flex-row-reverse h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col max-h-screen">
        <div className="text-right w-full bg-white shadow-sm">
          <Header />
        </div>

        <div className="flex-1 bg-[#F6F7FB] p-8 flex justify-end items-start pr-8">
          <form className="w-full max-w-xl space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <select
                name="category_name"
                value={formData.category_name}
                onChange={handleChange}
                className="border px-4 py-2 rounded text-right bg-white"
              >
                <option value="">اختر الصنف</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_name}>
                    {cat.category_name}
                  </option>
                ))}
              </select>

              <select
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                className="border px-4 py-2 rounded text-right bg-white"
              >
                <option value="">اختر المنتج</option>
                {products.map((prod) => (
                  <option key={prod.product_id} value={prod.product_id}>
                    {prod.product_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                name="product_price"
                type="number"
                value={formData.product_price}
                onChange={handleChange}
                className="border px-4 py-2 rounded text-right bg-white"
                placeholder="سعر البيع"
              />
              <input
                name="product_quantity"
                type="number"
                value={formData.product_quantity}
                onChange={handleChange}
                className="border px-4 py-2 rounded text-right bg-white"
                placeholder="الكمية"
              />
            </div>

            {Object.keys(attributes).length > 0 && (
              <div>
                <label className="block mb-1 font-medium text-right">الخصائص</label>
                {Object.entries(attributes).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <label className="block text-right text-sm text-gray-600 mb-1">{key}</label>
                    <input
                      value={value}
                      onChange={(e) => handleAttrChange(key, e.target.value)}
                      className="w-full border px-4 py-2 rounded text-right bg-white"
                      placeholder={`أدخل قيمة ${key}`}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 items-end">
              <input
                value={newAttr.key}
                onChange={(e) => setNewAttr({ ...newAttr, key: e.target.value })}
                placeholder="اسم خاصية جديدة"
                className="border px-4 py-2 rounded text-right bg-white"
              />
              <div className="flex gap-2">
                <input
                  value={newAttr.value}
                  onChange={(e) => setNewAttr({ ...newAttr, value: e.target.value })}
                  placeholder="قيمة"
                  className="border px-4 py-2 rounded text-right bg-white"
                />
                <button type="button" onClick={handleAddNewAttr} className="bg-gray-300 px-4 py-2 rounded">
                  ➕
                </button>
              </div>
            </div>

            {/* صورة مجرد شكل ثابت */}
            <div className="flex flex-row-reverse items-end justify-between gap-4">
              <div className="w-40 h-40 border rounded flex items-center justify-center bg-gray-100 text-gray-400 text-6xl">
                📷
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-blue-300 hover:bg-blue-200 rounded"
              >
                إضافة الخصائص
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Variant;
