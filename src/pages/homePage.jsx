import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import Header from '../components/header';

const HomePage = () => {
  const [showConfirm, setShowConfirm] = useState(false); 
  const inputClass = "w-full border border-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-right mb-3 bg-white";

  const handleEditClick = () => {
    setShowConfirm(true); 
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    alert("تم تعديل بياناتك بنجاح!");
  };

  const handleCancel = () => {
    setShowConfirm(false); 
  };

  return (
    <div className="flex flex-row-reverse h-screen">
      <Sidebar />
      <div className=" text-right w-full">
        <Header />
        <div className="flex-1  flex gap-6">
        <div className="w-1/3 bg-blue-50 p-6 rounded-lg shadow-md flex flex-col justify-start min-h-[calc(100vh-100px)]  pt-[60px]">
            <div className="text-center font-semibold mb-4">تعديل البيانات الشخصية</div>
            <input type="text" placeholder="اسم المستخدم" className={inputClass} />
            <input type="text" placeholder="الجيميل" className={inputClass} />
            <input type="password" placeholder="كلمة السر" className={inputClass} />
            <button onClick={handleEditClick} className="w-full bg-cyan-500 text-white p-2 rounded">
              تعديل بيانات الملف الشخصي
            </button>
          </div>
          <div className="flex-1 bg-blue-50 p-4 rounded-lg shadow-md flex flex-col justify-start min-h-[calc(100vh-100px)]  pt-[60px]">
          <div className="flex-1 grid grid-cols-2 gap-6 px-6 max-w-[800px] ">
            {[
              'كل المستخدمين',
              'المستخدمين الحاليين',
              'إجمالي المبيعات',
              'الطلبات الجديدة',
              'المستخدمين الجدد',
              'إجمالي الطلبات',
            ].map((title, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center w-80 h-40">
                <div>{title}</div>
                <div className="text-xl font-bold">0000</div>
              </div>
            ))}
          </div>
        </div>
        </div>
        {/* الرسالة التأكيدية */}
        {showConfirm && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    
    {/*  المودل */}
    <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-md w-[400px] text-center">
      <p className="mb-4 font-semibold text-gray-800"> !أنت على وشك تعديل بيانات ملفك الشخصي</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={handleConfirm}
          className="bg-cyan-600 text-white px-4 py-2 rounded"
        >
          تعديل
        </button>
        <button
          onClick={handleCancel}
          className="bg-blue-300 text-white px-4 py-2 rounded"
        >
          إلغاء
        </button>
      </div>
    </div>
  </div>
)}
 </div>
 </div>
  );
};

export default HomePage;
