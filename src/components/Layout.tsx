import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
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