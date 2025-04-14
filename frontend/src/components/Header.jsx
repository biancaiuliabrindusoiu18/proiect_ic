import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home')}>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c51da18b774ddfe28993c296441b7ba92143ca15"
          alt="Medical icon"
          className="w-10 h-10"
        />
        <div className="flex flex-col leading-tight">
          <span className="text-xl font-semibold text-gray-700">MedTrack</span>
          <span className="text-sm text-gray-400">track your medical analysis with ease</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
