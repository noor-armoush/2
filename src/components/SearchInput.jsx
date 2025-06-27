 // components/SearchInput.jsx
import React from 'react';

const SearchInput = ({ value, onChange }) => {
  return (
    <div className="flex flex-row items-center justify-start mb-2 p-2 bg-white rounded-md">
      {/* معلومات المستخدم */}
      <div className="flex items-center gap-2">
        <div className="text-2xl">👤</div>
        <span className="text-sm">admin</span>
      </div>

      {/* مربع البحث */}
      <div className="flex items-center gap-2 border px-4 py-2 rounded-lg w-80 ml-4">
        <span className="material-symbols-outlined">search</span>
        <input
          type="text"
          placeholder="البحث"
          className="outline-none bg-transparent w-full text-right"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SearchInput;
