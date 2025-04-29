import React, { useState } from 'react';
import { motion } from 'framer-motion';

const JojoTest = () => {
  const [loading, setLoading] = useState(false);
  
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-4">JOJO MBTI测试</h1>
          <p className="text-xl text-gray-200 mb-8">测试你是JOJO中的哪个角色，发现你的替身能力与性格特点</p>
        </div>
        
        <div className="bg-blue-800 bg-opacity-50 p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">测试说明</h2>
          <div className="text-white space-y-4">
            <p>这个测试将通过一系列问题评估你的性格特点，并找出你最匹配的JOJO角色。</p>
            <p>测试包含约20个问题，完成大约需要5分钟时间。</p>
            <p>请根据你的真实想法回答，这样结果会更准确。</p>
          </div>
        </div>
        
        <div className="text-center">
          <button 
            className={`px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg font-bold transition-all transform hover:scale-105 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={loading}
            onClick={() => {
              setLoading(true);
              // 模拟加载效果
              setTimeout(() => {
                setLoading(false);
                // 开始测试逻辑
                alert('测试功能正在开发中，敬请期待!');
              }, 1500);
            }}
          >
            {loading ? '加载中...' : '开始测试'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default JojoTest; 