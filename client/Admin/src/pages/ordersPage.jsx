import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import SearchInput from '../components/SearchInput';
import axios from 'axios';

const OrdersPage = () => {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const navigate = useNavigate();

  const [regions, setRegions] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders');
        setOrders(res.data);
      } catch (error) {
        console.error('فشل تحميل الطلبات', error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/regions');
        setRegions(res.data);
      } catch (error) {
        console.error('فشل تحميل المناطق', error);
      }
    };

    fetchRegions();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.user_name.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = selectedRegion ? order.region_name === selectedRegion : true;
    const matchesStatus = selectedStatus ? order.order_status === selectedStatus : true;
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
              <option value="">المناطق</option>
              {regions.map((region) => (
                <option key={region.region_id} value={region.region_name}>
                  {region.region_name}
                </option>
              ))}
            </select>

            <select
              className="px-4 py-2 border rounded-md"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">حالة الطلبية</option>
              <option value="غير معدة">غير معدة</option>
              <option value="مكتمل">مكتمل</option>
              <option value="تم الإرسال للشحن">تم الإرسال للشحن</option>
              <option value="تم الاستلام">تم الاستلام</option>
            </select>
            <button className="border rounded-md px-4 py-2 flex items-center gap-1">
              فلترة حسب
            </button>
          </div>

          <div className="overflow-x-auto bg-white shadow-md rounded-md">
            <table className="min-w-full text-center border-collapse">
              <thead className="bg-cyan-500 text-white">
                <tr>
                  <th className="px-6 py-3">التفاصيل</th>
                  <th className="px-6 py-3">حالة الطلبية</th>
                  <th className="px-6 py-3">العنوان التفصيلي</th>
                  <th className="px-6 py-3">العنوان</th>
                  <th className="px-6 py-3">المنطقة</th>
                  <th className="px-6 py-3">رقم الهاتف</th>
                  <th className="px-6 py-3">تاريخ الطلبية</th>
                  <th className="px-6 py-3">اسم المستخدم</th>
                  <th className="px-6 py-3">رقم الطلبية</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.order_id} className="border-t">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/order-details/${order.order_id}`)}
                        className="bg-cyan-500 text-white hover:bg-cyan-300 px-3 py-1 rounded-md"
                      >
                        التفاصيل
                      </button>
                    </td>
                    <td className="px-6 py-4">{order.order_status}</td>
                    <td className="px-6 py-4">{order.address_detail || '-'}</td>
                    <td className="px-6 py-4">{order.address}</td>
                    <td className="px-6 py-4">{order.region_name}</td>
                    <td className="px-6 py-4">{order.order_phone}</td>
                    <td className="px-6 py-4">{formatDate(order.order_date)}</td>
                    <td className="px-6 py-4">{order.user_name}</td>
                    <td className="px-6 py-4">{order.order_id}</td>
                  </tr>
                ))}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="9" className="py-4 text-gray-500">
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
