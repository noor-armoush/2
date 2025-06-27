import React from 'react';
import Sidebar from '../components/sidebar';

const UserInterface = () => {
  return (
    <div className="flex flex-row-reverse h-screen">
    <Sidebar />
  
      <div className="md:flex-1 flex justify-center items-center">
        <h1>واجهة المستخدم</h1>
      </div>
    </div>
  );
};

export default UserInterface;
