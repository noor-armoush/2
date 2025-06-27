import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const statuses = ['غير معدة', 'مكتمل', 'تم الإرسال للشحن', 'تم التسليم']; // ✅ تم التعديل هنا: تغيير "تم الاستلام" إلى "تم التسليم"

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [orderStatus, setOrderStatus] = useState('');
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [carType, setCarType] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${id}`);
        setOrder(res.data);
        setOrderStatus(res.data.order_status);
      } catch (err) {
        console.error('فشل تحميل بيانات الطلب', err);
      }
    };

    const fetchOrderProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${id}/products`);
        const dataWithSelection = res.data.map(p => ({ ...p, selected: true }));
        setProducts(dataWithSelection);
      } catch (err) {
        console.error('فشل تحميل منتجات الطلب', err);
      }
    };

    fetchOrderDetails();
    fetchOrderProducts();
  }, [id]);

  const updateOrderStatus = async (newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status: newStatus });
      const res = await axios.get(`http://localhost:5000/api/orders/${id}`);
      setOrder(res.data);
      setOrderStatus(res.data.order_status);
    } catch (err) {
      console.error('فشل تحديث حالة الطلبية', err);
    }
  };

  if (!order) {
    return <div className="text-center mt-10">جاري تحميل بيانات الطلب...</div>;
  }

  const totalAmount = products
    .filter((p) => p.selected)
    .reduce((total, item) => total + item.quantity * item.price, 0);

  const selectedCount = products.filter((p) => p.selected).length;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const currentStatusIndex = statuses.indexOf(orderStatus);

  return (
    <div className="flex flex-row-reverse min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6 space-y-6 text-right">
        <div className="overflow-x-auto bg-white shadow-md rounded-md">
          <table className="min-w-full text-center border-collapse">
            <thead className="bg-cyan-500 text-white">
              <tr>
                <th className="px-6 py-3">حالة الطلبية</th>
                <th className="px-6 py-3">العنوان</th>
                <th className="px-6 py-3">تاريخ الطلبية</th>
                <th className="px-6 py-3">اسم المستخدم</th>
                <th className="px-6 py-3">رقم الطلبية</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-6 py-4">{orderStatus}</td>
                <td className="px-6 py-4">{order.address}</td>
                <td className="px-6 py-4">{formatDate(order.order_date)}</td>
                <td className="px-6 py-4">{order.user_name}</td>
                <td className="px-6 py-4">{order.order_id}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <button className="px-4 py-2 text-right">حالة الطلبية</button>
        </div>

        <div className="flex justify-center flex-row-reverse space-x-2 space-x-reverse">
          {statuses.map((status, index) => {
            const isCompleted = orderStatus === 'تم التسليم'; // ✅ تم التعديل هنا
            const isActive = orderStatus === status;
            const isBefore = index < statuses.indexOf(orderStatus);

            return (
              <button
                key={status}
                onClick={() => {
                  if (!isBefore && !isCompleted) {
                    updateOrderStatus(status);
                    setShowShippingForm(status === 'تم الإرسال للشحن');
                  }
                }}
                className={`px-4 py-2 border rounded-full transition duration-300
                  ${isCompleted && status !== 'تم التسليم'
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : isActive
                    ? 'bg-cyan-700 text-white'
                    : isBefore
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white hover:bg-blue-100'}
                `}
                disabled={isBefore || (isCompleted && status !== 'تم التسليم')}
              >
                {status}
              </button>
            );
          })}
        </div>

        {showShippingForm && (
          <div className="bg-white rounded p-6 mt-6 max-w-xl mx-auto shadow-lg">
            <h3 className="font-bold mb-4 text-center">معلومات الشحن</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="اسم السائق"
                className="w-full border p-2 rounded text-right"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
              />
              <input
                type="text"
                placeholder="هاتف السائق"
                className="w-full border p-2 rounded text-right"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
              />
              <input
                type="text"
                placeholder="نوع سيارة الشحن"
                className="w-full border p-2 rounded text-right"
                value={carType}
                onChange={(e) => setCarType(e.target.value)}
              />
              <p className="text-sm text-red-600">* الرجاء تعبئة كافة الحقول</p>
              <div className="flex justify-center">
                <button
                  className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-600"
                  onClick={() => {
                    if (!driverName || !driverPhone || !carType) {
                      alert('يرجى تعبئة كافة الحقول');
                      return;
                    }
                    console.log('تم حفظ معلومات الشحن:', {
                      driverName,
                      driverPhone,
                      carType,
                    });
                    alert('تم حفظ البيانات بنجاح!');
                    setShowShippingForm(false);
                  }}
                >
                  حفظ البيانات
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-lg font-semibold text-right flex justify-start items-center gap-2 flex-row-reverse">
          <span>:المبلغ الكلي للمنتجات</span>
          <span className="bg-blue-100 px-3 py-1 rounded inline-block">₪ {totalAmount}</span>
          <span className="mx-2">:عدد المنتجات المحددة</span>
          <span className="inline-block bg-blue-100 px-2 py-1 rounded">{selectedCount}</span>
        </div>

        <div className="flex justify-end gap-4 mb-2">
          <button
            onClick={() =>
              setProducts((prev) => prev.map((product) => ({ ...product, selected: true })))
            }
            className="px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-600"
          >
            تحديد الكل
          </button>

          <button
            onClick={() =>
              setProducts((prev) => prev.map((product) => ({ ...product, selected: false })))
            }
            className="px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-600"
          >
            إلغاء التحديد
          </button>
        </div>

        <div className="overflow-x-auto bg-white shadow-md rounded-md">
          <table className="min-w-full text-center border-collapse">
            <thead className="bg-cyan-500 text-white">
              <tr>
                <th className="px-6 py-3">اختيار</th>
                <th className="px-6 py-3">السعر للقطعة الواحدة</th>
                <th className="px-6 py-3">العدد</th>
                <th className="px-6 py-3">اسم المنتج</th>
                <th className="px-6 py-3">اسم الصنف</th>
                <th className="px-6 py-3">رقم المنتج</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={product.selected}
                      onChange={() => {
                        const updated = [...products];
                        updated[index].selected = !updated[index].selected;
                        setProducts(updated);
                      }}
                      className="w-5 h-5"
                    />
                  </td>
                  <td className="px-6 py-4">₪{product.price}</td>
                  <td className="px-6 py-4">{product.quantity}</td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">{product.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
