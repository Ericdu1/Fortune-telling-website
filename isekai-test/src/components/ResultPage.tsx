import React from 'react';
import { motion } from 'framer-motion';

interface ResultPageProps {
  result: any;
  onRestart: () => void;
}

const ResultPage: React.FC<ResultPageProps> = ({ result, onRestart }) => {
  if (!result) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="text-2xl mb-4">生成结果中...</div>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // 基于世界类型选择主题
  const getWorldTheme = () => {
    const world = result.world.toLowerCase();
    if (world.includes('修真') || world.includes('仙侠') || world.includes('魔法')) {
      return 'fantasy-theme';
    } else if (world.includes('科技') || world.includes('未来')) {
      return 'scifi-theme';
    } else if (world.includes('诡异') || world.includes('恐怖')) {
      return 'horror-theme';
    } else if (world.includes('古代') || world.includes('历史')) {
      return 'ancient-theme';
    }
    return 'modern-theme';
  };

  return (
    <motion.div 
      className={`page-container ${getWorldTheme()}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto p-4">
        <motion.h1 
          className="text-4xl font-bold mb-8 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          你的穿越传奇
        </motion.h1>
        
        <motion.div 
          className="result-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-4">穿越世界</h2>
          <p className="text-xl mb-2">{result.world}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {result.worldFeatures.map((feature: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-opacity-30 bg-white rounded-full text-sm">
                {feature}
              </span>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="result-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-4">能力觉醒</h2>
          <p className="text-xl mb-2">{result.talent} ({result.talentLevel})</p>
          <p className="mb-4">{result.talentRarity}</p>
        </motion.div>
        
        <motion.div 
          className="result-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-4">关键事件</h2>
          <ul className="list-disc pl-6 space-y-1">
            {result.events.map((event: string, index: number) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
        </motion.div>
        
        <motion.div 
          className="result-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-2xl font-bold mb-4">穿越传奇</h2>
          
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">觉醒篇</h3>
            <p className="text-lg">{result.story.beginning}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">成长篇</h3>
            <p className="text-lg">{result.story.middle}</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2">巅峰篇</h3>
            <p className="text-lg">{result.story.ending}</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-xl"
            onClick={onRestart}
          >
            重新测试
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultPage; 