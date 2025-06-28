import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";
import SearchInput from "../components/SearchInput";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users"); // غيّر الرابط إذا احتجت
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.user_name.toLowerCase().includes(search) ||
      user.user_email.toLowerCase().includes(search) ||
      user.user_id.toString().includes(search)
    );
  });

  return (
    <div className="flex flex-row-reverse min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 p-6 text-right space-y-4">
        <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

        <div className="overflow-x-auto bg-white shadow-md rounded-md">
          <table className="min-w-full text-center border-collapse">
            <thead className="bg-cyan-500 text-white">
              <tr>
                <th className="px-6 py-3">العنوان</th>
                <th className="px-6 py-3">البريد</th>
                <th className="px-6 py-3">رقم الهاتف</th>
                <th className="px-6 py-3">المنطقة</th>
                <th className="px-6 py-3">اسم المستخدم</th>
                <th className="px-6 py-3">رقم المستخدم</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{user.user_address}</td>
                  <td className="px-6 py-4">{user.user_email}</td>
                  <td className="px-6 py-4">{user.user_phone}</td>
                  <td className="px-6 py-4">{user.region_name}</td>
                  <td className="px-6 py-4">{user.user_name}</td>
                  <td className="px-6 py-4">{user.user_id}</td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-4 text-gray-500">
                    لا توجد نتائج مطابقة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
