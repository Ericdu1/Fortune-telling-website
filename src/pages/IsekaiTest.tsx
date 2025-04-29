import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const IsekaiTest = () => {
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-emerald-900 to-blue-900 py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">异世界穿越测试</h1>
          <p className="text-xl text-gray-200">探索你专属的穿越故事，觉醒独特能力，面临命运挑战</p>
        </div>
        
        <div className="bg-slate-800 bg-opacity-50 p-8 rounded-lg shadow-lg text-white">
          <h2 className="text-2xl font-bold mb-6">测试介绍</h2>
          <p className="mb-4">这个测试将通过一系列问题，生成你专属的穿越故事。测试结果会随机组合世界观和能力系统，创造无数可能！</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div className="bg-opacity-20 bg-white p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2">世界随机</h3>
              <p>从修真仙侠到科技未来，从魔法奇幻到诡异恐怖，各种世界等你探索</p>
            </div>
            <div className="bg-opacity-20 bg-white p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2">能力多样</h3>
              <p>磁场转动、斗气体系、魔法天赋、科技才能等多种能力随机觉醒</p>
            </div>
            <div className="bg-opacity-20 bg-white p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2">命运多变</h3>
              <p>经历随机事件，创造独特故事，每次测试都会生成不同结局</p>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <Link to="/isekai-test/start">
              <motion.button
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-full text-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                开始测试
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IsekaiTest; 