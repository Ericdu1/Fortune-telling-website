import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ReactComponent as SiteIcon } from '../assets/site-icon.svg';
import { ReactComponent as JojoIcon } from '../assets/jojo-icon.svg';
import { ReactComponent as TarotIcon } from '../assets/tarot-icon.svg';
import { ReactComponent as FortuneIcon } from '../assets/fortune-icon.svg';
import { ReactComponent as IsekaiIcon } from '../assets/isekai-icon.svg';

const Sidebar = () => {
  return (
    <motion.div 
      className="fixed left-0 top-0 h-full w-16 bg-slate-800 text-white flex flex-col items-center py-4 shadow-lg"
      initial={{ x: -50 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <NavLink to="/" className="flex items-center justify-center">
          <SiteIcon className="w-10 h-10 text-blue-400" />
        </NavLink>
      </div>
      
      <nav className="flex flex-col items-center space-y-6 flex-1">
        <NavLink 
          to="/jojo-test" 
          className={({ isActive }) => 
            `w-12 h-12 flex items-center justify-center rounded-lg hover:bg-slate-700 transition-colors
             ${isActive ? 'bg-blue-900' : ''}`
          }
        >
          <JojoIcon className="w-6 h-6 text-blue-400" />
        </NavLink>
        
        <NavLink 
          to="/tarot" 
          className={({ isActive }) => 
            `w-12 h-12 flex items-center justify-center rounded-lg hover:bg-slate-700 transition-colors
             ${isActive ? 'bg-purple-900' : ''}`
          }
        >
          <TarotIcon className="w-6 h-6 text-purple-400" />
        </NavLink>
        
        <NavLink 
          to="/daily-fortune" 
          className={({ isActive }) => 
            `w-12 h-12 flex items-center justify-center rounded-lg hover:bg-slate-700 transition-colors
             ${isActive ? 'bg-orange-900' : ''}`
          }
        >
          <FortuneIcon className="w-6 h-6 text-orange-400" />
        </NavLink>
        
        <NavLink 
          to="/isekai-test" 
          className={({ isActive }) => 
            `w-12 h-12 flex items-center justify-center rounded-lg hover:bg-slate-700 transition-colors
             ${isActive ? 'bg-emerald-900' : ''}`
          }
        >
          <IsekaiIcon className="w-6 h-6 text-emerald-400" />
        </NavLink>
      </nav>
      
      <div className="mt-auto mb-4">
        <button className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
          <span className="text-xs font-bold text-white">?</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar; 