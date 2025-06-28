import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar';
import Header from '../components/header';

const Shipment = () => {
  const [formData, setFormData] = useState({
    driver_name: '',
    driver_phone: '',
    shipping_car: ''
  });

  const [shipments, setShipments] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/shipment');
        console.log('🚚 بيانات الشحن من الباك:', res.data); // <-- هذا يساعدك تشوفي إذا في بيانات بترجع
        setShipments(res.data);
      } catch (error) {
        console.error('فشل جلب بيانات الشحن:', error);
      }
    };
    fetchShipments();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post('http://localhost:5000/api/shipment', formData);
    const res = await axios.get('http://localhost:5000/api/shipment');
    setShipments(res.data);
    setFormData({ driver_name: '', driver_phone: '', shipping_car: '' });
  } catch (error) {
    if (error.response && error.response.status === 409) {
      alert('⚠️ رقم الهاتف موجود مسبقًا!');
    } else {
      console.error('فشل إضافة بيانات الشحن:', error);
    }
  }
};


  return (
    <div className="flex flex-row-reverse h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col max-h-screen">
        <div className="text-right w-full bg-white shadow-sm">
          <Header />
        </div>

        <div className="flex-1 bg-[#F6F7FB] p-8 flex flex-col items-end gap-8">
          <form className="w-full max-w-xl space-y-6" onSubmit={handleSubmit}>
            <input
              type="text"
              name="driver_name"
              value={formData.driver_name}
              onChange={handleChange}
              placeholder="اسم السائق"
              className="w-full border px-4 py-2 rounded text-right bg-white"
              required
            />
            <input
              type="text"
              name="driver_phone"
              value={formData.driver_phone}
              onChange={handleChange}
              placeholder="رقم الهاتف"
              className="w-full border px-4 py-2 rounded text-right bg-white"
              required
            />
            <input
              type="text"
              name="shipping_car"
              value={formData.shipping_car}
              onChange={handleChange}
              placeholder="نوع السيارة"
              className="w-full border px-4 py-2 rounded text-right bg-white"
              required
            />
            <button type="submit" className="px-6 py-2 bg-blue-300 hover:bg-blue-200 rounded">
              إضافة
            </button>
          </form>

          <table className="w-full max-w-xl text-right bg-white border mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">اسم السائق</th>
                <th className="border px-4 py-2">رقم الهاتف</th>
                <th className="border px-4 py-2">نوع السيارة</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((s, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{s.driver_name}</td>
                  <td className="border px-4 py-2">{s.driver_phone}</td>
                  <td className="border px-4 py-2">{s.shipping_car}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Shipment;
