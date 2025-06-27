import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import { FaTrash, FaEdit } from 'react-icons/fa';
import SearchInput from '../components/SearchInput';


const categoryMap = {
  1: 'طيور',
  2: 'أعشاش',
  3: 'أقفاص',
  4: 'أعلاف',
  5: 'مستلزمات أخرى',
};


const products = [
  { name: 'منتج 1', categoryId: 1, variant_id: 101, quantity: 200, price: 180 },
  { name: 'منتج 2', categoryId: 2, variant_id: 102, quantity: 100, price: 310 },
  { name: 'منتج 3', categoryId: 3, variant_id: 103, quantity: 120, price: 290 },
  { name: 'منتج 4', categoryId: 4, variant_id: 104, quantity: 150, price: 275 },
  { name: 'منتج 5', categoryId: 5, variant_id: 105, quantity: 30, price: 85 },
  { name: 'منتج 6', categoryId: 4, variant_id: 104, quantity: 36, price: 80 },
];


const variantImages = {
  101: 'https://example.com/images/variant101.png',
  102: 'https://example.com/images/variant102.png',
  103: 'https://example.com/images/variant103.png',
  104: 'https://example.com/images/variant104.png',
  105: 'https://example.com/images/variant105.png',
};

const AllProduct = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter((product) => {
    const categoryName = categoryMap[product.categoryId];
    const matchesCategory = selectedCategory ? categoryName === selectedCategory : true;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-row-reverse h-screen">
      <Sidebar />

      <div className="p-6 text-right w-full">
        {/*  البحث */}
        <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

       
        <div className="flex flex-row-reverse justify-start mb-4 items-center space-x-reverse space-x-2">
          <button className="border rounded-md px-4 py-2 flex items-center gap-1">
            <span className="material-symbols-outlined"></span>
            فلترة حسب الصنف
          </button>
          <select
            id="category"
            name="category"
            className="border rounded px-4 py-2 bg-white focus:outline-none text-center"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">الكل</option>
            <option value="طيور">طيور</option>
            <option value="أعشاش">أعشاش</option>
            <option value="أقفاص">أقفاص</option>
            <option value="أعلاف">أعلاف</option>
            <option value="مستلزمات أخرى">مستلزمات أخرى</option>
          </select>
        </div>

        {/* جدول المنتجات */}
        <div className="overflow-x-auto bg-white shadow-md rounded-md">
          <table className="min-w-full text-center border-collapse">
            <thead className="text-gray-700">
              <tr>
                <th className="py-3 px-6 bg-cyan-500 text-white"> </th>
                <th className="py-3 px-6 bg-cyan-500 text-white"> </th>
                <th className="py-3 px-6 bg-cyan-500 text-white">سعر البيع</th>
                <th className="py-3 px-6 bg-cyan-500 text-white">الكمية المتوفرة</th>
                <th className="py-3 px-6 bg-cyan-500 text-white">اسم المنتج</th>
                <th className="py-3 px-6 bg-cyan-500 text-white">الصنف</th>
                <th className="py-3 px-6 bg-cyan-500 text-white">صورة</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={index} className="border-t text-center">
                  <td className="py-4 px-6">
                    <button className="bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-300">
                      التفاصيل
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
                  <td className="py-2 px-4">{product.price}</td>
                  <td className="py-2 px-4">{product.quantity}</td>
                  <td className="py-2 px-4">{product.name}</td>
                  <td className="py-2 px-4">{categoryMap[product.categoryId]}</td>
                  <td className="py-2 px-4">
                    <img
                      src={variantImages[product.variant_id]}
                      alt="صورة الصنف"
                      className="mx-auto h-10 w-10 object-contain"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-4 text-gray-500">لا توجد منتجات لهذا الصنف.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProduct;
