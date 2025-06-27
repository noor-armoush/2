import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { FaTrash, FaEdit } from 'react-icons/fa';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState(""); // جديد
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showProductsFor, setShowProductsFor] = useState(null); // ID الصنف المعروض حاليًا


  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/allCategories");
      const data = Array.isArray(response.data) ? response.data : response.data?.rows || [];
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/category/${id}`, {
        name: editedName,
      });

      const updated = categories.map((cat) =>
        cat.category_id === id ? { ...cat, category_name: editedName } : cat
      );
      setCategories(updated);
      setEditId(null);
      setEditedName("");
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // دالة إضافة صنف جديد
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("اسم الصنف لا يمكن أن يكون فارغاً");
      return;
    }

    try {
      // نفترض أن ال API لإضافة صنف جديد هو POST على هذا الرابط مع { name: ... }
      await axios.post("http://localhost:5000/api/category", {
        name: newCategoryName,
      });

      // بعد الإضافة نعيد جلب البيانات لتحديث القائمة
      fetchCategories();
      setNewCategoryName(""); // إفراغ الحقل
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };
  // ✅ حذف صنف
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا الصنف وكل ما يرتبط به؟")) return;

    try {
      await axios.delete(`http://localhost:5000/api/category/${id}`);
      // تحديث القائمة بعد الحذف
      setCategories(categories.filter(cat => cat.category_id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("فشل حذف الصنف. تأكد من اتصال الخادم.");
    }
  };
  const handleShowProducts = async (categoryId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/category/${categoryId}/products`);
      setSelectedProducts(response.data);
      setShowProductsFor(categoryId);
    } catch (error) {
      console.error("Error fetching products for category:", error);
    }
  };


  return (
    <div className="flex flex-row-reverse h-screen">
      <Sidebar />
      <div className=" text-right w-full">
        <Header />
        <div className="w-full min-h-screen p-8 ">

          <div className="bg-white p-4 rounded flex flex-col items-center">
            <div className="flex flex-col gap-4 items-center w-full max-w-xs">
              {/* حقل إدخال اسم الصنف */}
              <input
                type="text"
                placeholder="اسم الصنف"
                className="border border-gray-300 rounded px-4 py-2 w-full text-center"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              {/* زر إضافة صنف */}
              <button
                className="bg-cyan-500 text-white px-6 py-2 rounded hover:bg-cyan-400 w-40"
                onClick={handleAddCategory}
              >
                إضافة صنف
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white shadow-md rounded-md mt-6">
            <table className="min-w-full text-center border-collapse">
              <thead className="bg-cyan-500 text-white">
                <tr>
                  <th className="px-6 py-3">عرض المنتجات</th>
                  <th className="px-6 py-3">الإجراءات</th>
                  <th className="px-6 py-3">عدد المنتجات ضمن هذا الصنف</th>
                  <th className="px-6 py-3">اسم الصنف</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr key={`cat-${index}`} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <button
                        className="bg-cyan-500 px-3 py-1 rounded text-white"
                        onClick={() => handleShowProducts(cat.category_id)}
                      >
                        عرض المنتجات
                      </button>

                    </td>
                    <td className="py-2 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {editId === cat.category_id ? (
                          <>
                            <button
                              className="text-green-600"
                              onClick={() => handleSaveEdit(cat.category_id)}
                            >
                              حفظ
                            </button>
                            <button
                              className="text-gray-600"
                              onClick={() => {
                                setEditId(null);
                                setEditedName("");
                              }}
                            >
                              إلغاء
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="text-blue-600 mr-2"
                              onClick={() => {
                                setEditId(cat.category_id);
                                setEditedName(cat.category_name);
                              }}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="text-red-600"
                              onClick={() => handleDeleteCategory(cat.category_id)}
                            >
                              <FaTrash />
                            </button>

                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {cat.product_count}
                    </td>
                    <td className="px-6 py-4">
                      {editId === cat.category_id ? (
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="border px-2 py-1 rounded text-right w-40"
                        />
                      ) : (
                        cat.category_name
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
{showProductsFor && (
  <div className="mt-6 bg-white shadow rounded p-4">
    <h2 className="text-lg font-semibold mb-4">المنتجات ضمن الصنف</h2>
    {selectedProducts.length === 0 ? (
      <p className="text-gray-500 text-center">لا توجد منتجات ضمن هذا الصنف</p>
    ) : (
      <table className="min-w-full text-center border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 border">اسم المنتج</th>
            <th className="px-6 py-3 border">وصف المنتج</th>
          </tr>
        </thead>
        <tbody>
          {selectedProducts.map((product, idx) => (
            <tr key={idx} className="border-t hover:bg-gray-50">
              <td className="px-6 py-4 border">{product.product_name}</td>
              <td className="px-6 py-4 border">{product.product_description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)}

        </div>
      </div>
    </div>
  );
};

export default Category;
