import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import SearchInput from '../components/SearchInput';

const Sales = () => {
  const [mode, setMode] = useState('yearly'); // "yearly" , "monthly" , "category"

 
  const [filterCategory, setFilterCategory] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');

  const yearlyData = Array(6).fill({
    year: "0000",
    totalSales: "0000",
    totalQuantity: "0000",
    mostSold: "منتج",
    growth: "%00"
  });

  const monthlyData = Array(6).fill({
    year: "06 / 2025",
    totalSales: "500",
    totalQuantity: "100",
    mostSold: "منتج شهري",
    growth: "%10"
  });

 
  const categoryData = [
    { category: 'طيور', product: 'كناري', year: '2025', month1: 'يناير', month2: 'فبراير', total: '1200', percentage: '25%' },
    { category: 'أعشاش', product: 'عش فنك', year: '2025', month1: 'يناير', month2: 'مارس', total: '500', percentage: '10%' },
    { category: 'أقفاص', product: 'مفرد', year: '2024', month1: 'فبراير', month2: 'مارس', total: '700', percentage: '15%' },
    { category: 'أعلاف', product: 'بزر', year: '2025', month1: 'مارس', month2: 'أبريل', total: '300', percentage: '7%' },
    { category: 'مستلزمات أخرى', product: 'مشرب', year: '2023', month1: 'يناير', month2: 'فبراير', total: '200', percentage: '4%' },
   
  ];

  
  const filteredCategoryData = categoryData.filter(item => {
   
    const matchCategory = filterCategory ? item.category === filterCategory : true;
    
    const matchMonth = filterMonth ? (item.month1 === filterMonth || item.month2 === filterMonth) : true;
 
    const matchYear = filterYear ? item.year === filterYear : true;

    return matchCategory && matchMonth && matchYear;
  });

  const renderTable = () => {
    if (mode === 'category') {
      return (
        <>
          
          <div className="flex gap-4 mb-4 justify-end">
            <select
              className="border rounded px-4 py-2 text-right"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
            >
              <option value=""> الصنف</option>
              <option value="طيور">طيور</option>
              <option value="أعشاش">أعشاش</option>
              <option value="أقفاص">أقفاص</option>
              <option value="أعلاف">أعلاف</option>
              <option value="مستلزمات أخرى">مستلزمات أخرى</option>
            </select>
            <select
              className="border rounded px-4 py-2 text-right"
              value={filterMonth}
              onChange={e => setFilterMonth(e.target.value)}
            >
              <option value=""> الشهر</option>
              <option value="يناير">يناير</option>
              <option value="فبراير">فبراير</option>
              <option value="مارس">مارس</option>
              <option value="أبريل">أبريل</option>
              <option value="مايو">مايو</option>
              <option value="يونيو">يونيو</option>
              <option value="يوليو">يوليو</option>
              <option value="أغسطس">أغسطس</option>
              <option value="سبتمبر">سبتمبر</option>
              <option value="أكتوبر">أكتوبر</option>
              <option value="نوفمبر">نوفمبر</option>
              <option value="ديسمبر">ديسمبر</option>
            </select>
            <select
              className="border rounded px-4 py-2 text-right"
              value={filterYear}
              onChange={e => setFilterYear(e.target.value)}
            >
              <option value=""> السنة</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
            <button
              className="bg-white border px-4 py-2 rounded"
              onClick={() => {
               
              }}
            >
              فلترة حسب
            </button>
          </div>

          {/* جدول الصنف */}
          <div className="overflow-x-auto bg-white shadow-md rounded-md">
            <table className="min-w-full text-center border-collapse">
              <thead className="bg-cyan-500 text-white">
                <tr>
                  <th className="px-6 py-3">النسبة من الإجمالى (%)</th>
                  <th className="px-6 py-3">المجموع</th>
                  <th className="px-6 py-3">شهر</th>
                  <th className="px-6 py-3">شهر</th>
                  <th className="px-6 py-3">السنة</th>
                  <th className="px-6 py-3">المنتج</th>
                  <th className="px-6 py-3">الصنف</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategoryData.length > 0 ? (
                  filteredCategoryData.map((row, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-6 py-4">{row.percentage}</td>
                      <td className="px-6 py-4">{row.total}</td>
                      <td className="px-6 py-4">{row.month1}</td>
                      <td className="px-6 py-4">{row.month2}</td>
                      <td className="px-6 py-4">{row.year}</td>
                      <td className="px-6 py-4">{row.product}</td>
                      <td className="px-6 py-4">{row.category}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-4">
                      لا توجد بيانات تطابق الفلترة
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      );
    }

    const rows = mode === 'yearly' ? yearlyData : monthlyData;

    return (
      <div className="overflow-x-auto bg-white shadow-md rounded-md">
        <table className="min-w-full text-center border-collapse">
          <thead className="bg-cyan-500 text-white">
            <tr>
              <th className="px-6 py-3">نسبة النمو مقارنة بالسنة السابقة</th>
              <th className="px-6 py-3">المنتجات الأكثر مبيعاً</th>
              <th className="px-6 py-3">إجمالي الكمية</th>
              <th className="px-6 py-3">إجمالي المبيعات</th>
              <th className="p-2">{mode === 'yearly' ? 'السنة' : 'الشهر'}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t text-sm">
                <td className="px-6 py-4">{row.growth}</td>
                <td className="px-6 py-4">{row.mostSold}</td>
                <td className="px-6 py-4">{row.totalQuantity}</td>
                <td className="px-6 py-4">{row.totalSales}</td>
                <td className="px-6 py-4">{row.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex flex-row-reverse h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <SearchInput />

        {/* أزرار التصفية */}
        <div className="flex gap-2 mb-4 justify-end">
          <button className="px-4 py-1 rounded bg-blue-200">رسوم بيانية</button>
          <button 
            onClick={() => setMode('category')}
            className={`px-4 py-1 rounded font-bold ${mode === 'category' ? 'bg-cyan-500' : 'bg-blue-200'}`}
          >
            الصنف
          </button>
          <button 
            onClick={() => setMode('yearly')}
            className={`px-4 py-1 rounded font-bold ${mode === 'yearly' ? 'bg-cyan-500' : 'bg-blue-200'}`}
          >
            سنوي
          </button>
          <button 
            onClick={() => setMode('monthly')}
            className={`px-4 py-1 rounded font-bold ${mode === 'monthly' ? 'bg-cyan-500' : 'bg-blue-200'}`}
          >
            شهري
          </button>
        </div>

        {renderTable()}
      </div>
    </div>
  );
};

export default Sales;
