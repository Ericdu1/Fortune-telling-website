import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

// 注意：这个Layout组件不需要HomeProps属性
const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 ml-16 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 