import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import SearchInput from "../components/SearchInput";

const users = [
  {
    id: "00001",
    name: "مستخدم 1",
    region: "منطقة 1",
    phone: "0000000000",
    email: "example1@gmail.com",
    address: "عنوان 1",
  },
  {
    id: "00002",
    name: "مستخدم 2",
    region: "منطقة 2",
    phone: "0000000000",
    email: "example@gmail.com",
    address: "عنوان 1",
  },
  {
    id: "00003",
    name: "مرح",
    region: "منطقة 3",
    phone: "0000000000",
    email: "example@gmail.com",
    address: "عنوان 1",
  },
  {
    id: "00004",
    name: "مستخدم 4",
    region: "منطقة 1",
    phone: "0000000000",
    email: "example@gmail.com",
    address: "عنوان 1",
  },
  {
    id: "00005",
    name: "مستخدم 5",
    region: "منطقة 1",
    phone: "0000000000",
    email: "example@gmail.com",
    address: "عنوان 1",
  },
  {
    id: "00006",
    name: "مستخدم 6",
    region: "منطقة 3",
    phone: "0000000000",
    email: "example@gmail.com",
    address: "عنوان 1",
  },
];

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.id.includes(search)
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
                  <td className="px-6 py-4">{user.address}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4">{user.region}</td>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.id}</td>
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
