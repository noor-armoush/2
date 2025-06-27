import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/homePage';
import AllProduct from "./pages/allProduct";
import OrdersPage from './pages/ordersPage';
import AddProduct from './pages/addProduct';
import Category from './pages/category';
import Sales from './pages/sales';
import Users from './pages/users';
import UserReviews from './pages/userReviews';
import UserInterface from './pages/userInterface';
import OrderDetailsPage from './pages/OrderDetailsPage';

const App = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Navigate to="/HomePage" />} />
        
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/allProduct" element={<AllProduct />} />
        <Route path="/ordersPage" element={<OrdersPage />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/category" element={<Category />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/users" element={<Users />} />
        <Route path="/userReviews" element={<UserReviews />} />
        <Route path="/userInterface" element={<UserInterface />} />
        <Route path="/order-details/:id" element={<OrderDetailsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
