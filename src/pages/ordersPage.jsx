import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import SearchInput from '../components/SearchInput';

const orders = [
  { id: '00001', user: 'مستخدم 1', date: '2025-06-01', regionId: 3, address: 'العنوان 25', status: 'مكتمل' },
  { id: '00002', user: 'مستخدم 2', date: '2025-06-03', regionId: 1, address: 'العنوان 3', status: 'قيد التجهيز' },
  { id: '00003', user: 'مستخدم 3', date: '2025-06-05', regionId: 1, address: 'العنوان 5', status: 'غير ناجحة' },
  { id: '00004', user: 'مستخدم 4', date: '2025-06-07', regionId: 1, address: 'العنوان 8', status: 'إرسال للشحن' },
  { id: '00005', user: 'مستخدم 5', date: '2025-06-08', regionId: 1, address: 'العنوان 2', status: 'تم الشحن' },
  { id: '00006', user: 'مستخدم 6', date: '2025-06-09', regionId: 1, address: 'العنوان 1', status: 'قيد التجهيز' },
];

const regionNames = {
  1: 'الضفة',
  2: 'الداخل',
  3: 'القدس',
};

const OrdersPage = () => {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const navigate = useNavigate();

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.user.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = selectedRegion ? order.regionId === Number(selectedRegion) : true;
    const matchesStatus = selectedStatus ? order.status === selectedStatus : true;
    return matchesSearch && matchesRegion && matchesStatus;
  });

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('ar-EG', options);
  };

  return (
    <div className="flex flex-row-reverse h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-6">
          <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <div className="flex gap-2 items-center justify-end mb-4">
            <select
              className="px-4 py-2 border rounded-md"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value=""> المناطق</option>
              <option value="1">الضفة</option>
              <option value="2">الداخل</option>
              <option value="3">القدس</option>
            </select>

            <select
              className="px-4 py-2 border rounded-md"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">حالة الطلبية</option>
              <option value="مكتمل">مكتمل</option>
              <option value="قيد التجهيز">قيد التجهيز</option>
              <option value="غير ناجحة">غير ناجحة</option>
              <option value="إرسال للشحن">إرسال للشحن</option>
              <option value="تم الشحن">تم الشحن</option>
            </select>

            <button className="border rounded-md px-4 py-2 flex items-center gap-1">
              <span className="material-symbols-outlined"></span>
              فلترة حسب
            </button>
          </div>

          <div className="overflow-x-auto bg-white shadow-md rounded-md">
            <table className="min-w-full text-center border-collapse">
              <thead className="bg-cyan-500 text-white">
                <tr>
                  <th className="px-6 py-3 ">التفاصيل</th>
                  <th className="px-6 py-3 ">حالة الطلبية</th>
                  <th className="px-6 py-3 ">العنوان</th>
                  <th className="px-6 py-3 ">المنطقة</th>
                  <th className="px-6 py-3 ">تاريخ الطلبية</th>
                  <th className="px-6 py-3 ">اسم المستخدم</th>
                  <th className="px-6 py-3 ">رقم الطلبية</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/order-details/${order.id}`)}
                        className="bg-cyan-500 text-white hover:bg-cyan-300 px-3 py-1 rounded-md"
                      >
                        التفاصيل
                      </button>
                    </td>
                    <td className="px-6 py-4">{order.status}</td>
                    <td className="px-6 py-4">{order.address}</td>
                    <td className="px-6 py-4">{regionNames[order.regionId]}</td>
                    <td className="px-6 py-4">{formatDate(order.date)}</td>
                    <td className="px-6 py-4">{order.user}</td>
                    <td className="px-6 py-4">{order.id}</td>
                  </tr>
                ))}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-4 text-gray-500">
                      لا توجد طلبات مطابقة للبحث
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
