import React from 'react';
import { motion } from 'framer-motion';

const TarotPage = () => {
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-4">塔罗牌占卜</h1>
        <p className="text-xl text-gray-200 mb-8">探索塔罗牌的神秘力量，预测你的未来走向</p>
        
        <div className="bg-purple-800 bg-opacity-50 p-8 rounded-lg">
          <p className="text-white text-2xl">即将开始占卜...</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TarotPage; 