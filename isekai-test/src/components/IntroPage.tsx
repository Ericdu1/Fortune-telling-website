import React from 'react';
import { motion } from 'framer-motion';

interface IntroPageProps {
  onStart: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onStart }) => {
  return (
    <motion.div 
      className="page-container scifi-theme"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="animated-bg">
        <div className="stars"></div>
      </div>

      <motion.div 
        className="text-center max-w-3xl mx-auto"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold mb-6">多维世界穿越测试</h1>
        <p className="text-xl mb-8">你将穿越到哪个世界？觉醒什么能力？面临怎样的命运？</p>
        <p className="mb-12 text-lg">这个测试将通过一系列问题，生成你专属的穿越故事。测试结果会随机组合世界观和能力系统，创造无数可能！</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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

        <motion.button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-xl"
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          开始测试
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default IntroPage; 