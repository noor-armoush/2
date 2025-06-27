import React, { useState } from "react";
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { FaTrash, FaEdit } from 'react-icons/fa';

const Category = () => {
  const [categories, setCategories] = useState([
    { id: "00001", name: "طيور", count: 50 },
    { id: "00002", name: "اعشاش", count: 30 },
    { id: "00003", name: "اقفاص", count: 40 },
    { id: "00004", name: "اعلاف", count: 20 },
    { id: "00005", name: "مستلزمات اخرى", count: 96 },
  ]);

  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddCategory = () => {
    if (newCategoryName.trim() === "") return;

    const newCategory = {
      id: String(categories.length + 1).padStart(5, "0"),
      name: newCategoryName,
      count: 0,
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName("");
  };

  const handleDeleteCategory = (id) => {
    const filtered = categories.filter((cat) => cat.id !== id);
    setCategories(filtered);
  };

  return (
    <div className="flex flex-row-reverse h-screen">
    <Sidebar />
    <div className=" text-right w-full">
        <Header />
    <div className="w-full min-h-screen p-8 ">

<div className="bg-white p-4 rounded flex flex-col items-center">
  <div className="flex flex-col gap-4 items-center w-full max-w-xs">
    <input
      type="text"
      placeholder="اسم الصنف"
      className="border border-gray-300 rounded px-4 py-2 w-full text-center"
      value={newCategoryName}
      onChange={(e) => setNewCategoryName(e.target.value)}
    />
    <button
      onClick={handleAddCategory}
      className="bg-cyan-500 text-white px-6 py-2 rounded hover:bg-cyan-400 w-40"
    >
      إضافة صنف
    </button>
  </div>
</div>

     
      <div className="overflow-x-auto bg-white shadow-md rounded-md">
      <table className="min-w-full text-center border-collapse">
  <thead className="bg-cyan-500 text-white">
    <tr>  
      <th className="px-6 py-3">عرض المنتجات</th> 
      <th className="px-6 py-3">الإجراءات</th> 
      <th className="px-6 py-3">عدد المنتجات ضمن هذا الصنف</th>
      <th className="px-6 py-3">اسم الصنف</th>
      <th className="px-6 py-3">رقم الصنف</th>
    </tr>
  </thead>
  <tbody>
    {categories.map((cat) => (
      <tr key={cat.id} className="border-t hover:bg-gray-50">
        <td className="px-6 py-4">
          <button className="bg-cyan-500 px-3 py-1 rounded text-white">
            عرض المنتجات
          </button>
        </td>
        <td className="py-2 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="text-blue-600">
                        <FaEdit />
                      </button>  
                      <button className="text-red-600">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
        <td className="px-6 py-4">{cat.count}</td>
        <td className="px-6 py-4">{cat.name}</td>
        <td className="px-6 py-4">{cat.id}</td>
      </tr>
    ))}
  </tbody>
</table>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Category;