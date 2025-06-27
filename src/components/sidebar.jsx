import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const linkClass = (path) =>
  `block px-4 py-3 rounded mb-2 text-center ${
    location.pathname === path
      ? 'bg-cyan-500 text-white font-semibold'
      : 'bg-blue-50 hover:bg-blue-100 text-gray-700'
  }`;
  return (
    <div className="w-full md:w-64 bg-white border rounded-lg p-4 flex flex-col justify-between h-screen">

      <div >
      <Link to="/homePage" className={linkClass('/homePage')}>الصفحة الرئيسية</Link>
        <Link to="/allProduct" className={linkClass('/allProduct')}>كافة المنتجات</Link>
        <Link to="/ordersPage" className={linkClass('/ordersPage')}>قائمة الطلبات </Link>
      </div>
      <div className=" mt-15">
        <Link to="/addProduct" className={linkClass('/addProduct')}>اضافة منتج</Link>
        <Link to="/category" className={linkClass('/category')}>الاصناف</Link>
        <Link to="/sales" className={linkClass('/sales')}>المبيعات</Link>
        </div>
        <div className=" mt-15">
        <Link to="/users" className={linkClass('/users')}>المستخدمين</Link>
        <Link to="/userReviews" className={linkClass('/userReviews')}>تقييمات المستخدمين</Link>
        <Link to="/userInterface" className={linkClass('/userInterface')}>واجهة المستخدم</Link>
        </div>
       
      <button className="w-full text-center text-red-600 mt-10">تسجيل الخروج</button>
    </div>
  );
};

export default Sidebar;
