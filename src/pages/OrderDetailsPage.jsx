import React, { useState } from "react";
import Sidebar from "../components/sidebar";

const sampleOrder = {
  id: "00006",
  user: "مستخدم 6",
  date: "14 Feb 2019",
  address: "رام الله دير جرير",
  status: "قيد التجهيز",
  products: [
    {
      id: "00004",
      category: "صنف1",
      name: "منتج 1",
      quantity: 50,
      price: 75,
      selected: true,
    },
    {
      id: "00016",
      category: "صنف1",
      name: "منتج 16",
      quantity: 20,
      price: 40,
      selected: false,
    },
  ],
};

const statuses = ["غير معدة", "قيد التجهيز", "مكتمل", "إرسال للشحن", "تم الشحن"];

const OrderDetailsPage = () => {
  const [orderStatus, setOrderStatus] = useState(sampleOrder.status);
  const [products, setProducts] = useState(sampleOrder.products);

  const [showShippingForm, setShowShippingForm] = useState(false);
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [carType, setCarType] = useState("");

  const totalAmount = products
    .filter((p) => p.selected)
    .reduce((total, item) => total + item.quantity * item.price, 0);

  const selectedCount = products.filter((p) => p.selected).length;

  return (
    <div className="flex flex-row-reverse min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6 space-y-6 text-right">
        {/* جدول الطلب الأساسي */}
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
                <td className="px-6 py-4">{sampleOrder.address}</td>
                <td className="px-6 py-4">{sampleOrder.date}</td>
                <td className="px-6 py-4">{sampleOrder.user}</td>
                <td className="px-6 py-4">{sampleOrder.id}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <button className="px-4 py-2 text-right">حالة الطلبية</button>
        </div>

        {/* حالة الطلبية */}
        <div className="flex justify-center flex-row-reverse space-x-2 space-x-reverse">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => {
                if (status === "إرسال للشحن") {
                  setShowShippingForm(true);
                  setOrderStatus(status);
                } else {
                  setOrderStatus(status);
                  setShowShippingForm(false);
                }
              }}
              className={`px-4 py-2 border rounded-full ${
                orderStatus === status
                  ? "bg-cyan-700 text-white"
                  : "bg-white hover:bg-blue-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* نموذج الشحن */}
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
                      alert("يرجى تعبئة كافة الحقول");
                      return;
                    }
                    console.log("تم حفظ معلومات الشحن:", {
                      driverName,
                      driverPhone,
                      carType,
                    });
                    alert("تم حفظ البيانات بنجاح!");
                    setShowShippingForm(false);
                  }}
                >
                  حفظ البيانات
                </button>
              </div>
            </div>
          </div>
        )}

        {/* المبلغ الكلي */}
        <div className="text-lg font-semibold text-right flex justify-start items-center gap-2 flex-row-reverse">
          <span>:المبلغ الكلي للمنتجات</span>
          <span className="bg-blue-100 px-3 py-1 rounded inline-block">₪ {totalAmount}</span>
          <span className="mx-2">:عدد المنتجات المحددة</span>
          <span className="inline-block bg-blue-100 px-2 py-1 rounded">{selectedCount}</span>
        </div>

        {/* أزرار تحديد الكل وإلغاء التحديد */}
        <div className="flex justify-end gap-4 mb-2">
          <button
            onClick={() =>
              setProducts((prev) =>
                prev.map((product) => ({ ...product, selected: true }))
              )
            }
            className="px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-600"
          >
            تحديد الكل
          </button>

          <button
            onClick={() =>
              setProducts((prev) =>
                prev.map((product) => ({ ...product, selected: false }))
              )
            }
            className="px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-600"
          >
            إلغاء التحديد
          </button>
        </div>

        {/* جدول المنتجات */}
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
