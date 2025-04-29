import React from 'react';
import { motion } from 'framer-motion';

const FortunePage = () => {
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-orange-900 to-red-800 py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-4">每日运势</h1>
        <p className="text-xl text-gray-200 mb-8">每天一次的运势预测，了解今日的吉凶祸福</p>
        
        <div className="bg-orange-800 bg-opacity-50 p-8 rounded-lg">
          <p className="text-white text-2xl">正在计算今日运势...</p>
        </div>
      </div>
    </motion.div>
  );
};

export default FortunePage; 