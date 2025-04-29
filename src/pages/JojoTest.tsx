import React from 'react';
import { motion } from 'framer-motion';

const JojoTest = () => {
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-4">JOJO MBTI测试</h1>
        <p className="text-xl text-gray-200 mb-8">测试你是JOJO中的哪个角色，发现你的替身能力与性格特点</p>
        
        <div className="bg-blue-800 bg-opacity-50 p-8 rounded-lg">
          <p className="text-white text-2xl">即将开始测试...</p>
        </div>
      </div>
    </motion.div>
  );
};

export default JojoTest; 