import React from 'react';
import Sidebar from '../components/sidebar';

const UserReviews = () => {
  const reviews = [1, 2, 3]; // افتراضًا 3 تقييمات

  return (
    <div className="flex flex-row-reverse h-screen">
    <Sidebar />
    <div className="flex">
      {/* Sidebar موجود مسبقًا */}
      
      <div className="flex-1 p-6">
{/* رأس التصفية */}
<div className="flex justify-end mb-4 gap-4 items-center">
  {/* مستطيل فيه "فلترة حسب" */}
  <div className="bg-gray-100 px-4 py-2 rounded text-sm text-gray-700 shadow-sm">
    فلترة حسب
  </div>

  {/* قائمة الصنف */}
  <select className="border rounded px-3 py-2 text-sm">
    <option>الصنف</option>
    <option>طيور</option>
    <option>أعشاش</option>
    <option>أقفاص</option>
    <option>أعلاف</option>
    <option>مستلزمات أخرى</option>
  </select>

  {/* قائمة اسم المنتج */}
  <select className="border rounded px-3 py-2 text-sm">
    <option>اسم المنتج</option>
    <option>منتج 1</option>
    <option>منتج 2</option>
    <option>منتج 3</option>
  </select>
</div>


        
      </div>
    </div>
    </div>
  );
};

export default UserReviews;