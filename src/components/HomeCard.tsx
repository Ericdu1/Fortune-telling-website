import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import jojoIcon from '../assets/jojo-icon.svg';
import tarotIcon from '../assets/tarot-icon.svg';
import fortuneIcon from '../assets/fortune-icon.svg';
import isekaiIcon from '../assets/isekai-icon.svg';
import moreIcon from '../assets/more-icon.svg';

interface HomeCardProps {
  title: string;
  description: string;
  icon: 'jojo' | 'tarot' | 'fortune' | 'isekai' | 'more';
  path: string;
  isNew?: boolean;
  isHot?: boolean;
  comingSoon?: boolean;
}

const HomeCard: React.FC<HomeCardProps> = ({ 
  title, 
  description, 
  icon, 
  path, 
  isNew = false, 
  isHot = false,
  comingSoon = false 
}) => {
  
  const getIcon = () => {
    switch(icon) {
      case 'jojo':
        return <img src={jojoIcon} alt="JOJO MBTI" className="w-16 h-16" />;
      case 'tarot':
        return <img src={tarotIcon} alt="塔罗牌" className="w-12 h-12" />;
      case 'fortune':
        return <img src={fortuneIcon} alt="每日运势" className="w-12 h-12" />;
      case 'isekai':
        return <img src={isekaiIcon} alt="异世界穿越" className="w-12 h-12" />;
      case 'more':
        return <img src={moreIcon} alt="更多功能" className="w-12 h-12" />;
      default:
        return null;
    }
  };
  
  // 根据图标类型决定卡片背景
  const getCardBackground = () => {
    switch(icon) {
      case 'jojo':
        return 'bg-gradient-to-br from-blue-900 to-blue-700';
      case 'tarot':
        return 'bg-gradient-to-br from-purple-900 to-purple-700';
      case 'fortune':
        return 'bg-gradient-to-br from-orange-900 to-orange-600';
      case 'isekai':
        return 'bg-gradient-to-br from-emerald-900 to-emerald-600';
      case 'more':
        return 'bg-gradient-to-br from-indigo-900 to-indigo-700';
      default:
        return 'bg-gradient-to-br from-gray-900 to-gray-700';
    }
  };

  return (
    <motion.div 
      className={`relative rounded-xl p-6 shadow-lg overflow-hidden ${getCardBackground()}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isNew && (
        <div className="absolute top-0 right-0">
          <div className="bg-red-500 text-white font-bold py-1 px-4 transform rotate-45 translate-x-6 -translate-y-1">
            NEW
          </div>
        </div>
      )}
      
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-full bg-opacity-20 bg-white mr-4">
          {getIcon()}
        </div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      
      <p className="text-white text-opacity-90 mb-6 min-h-[60px]">{description}</p>
      
      <div className="flex justify-between items-center">
        {isHot && (
          <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-full">
            热门
          </span>
        )}
        {!isHot && <div></div>}
        
        {comingSoon ? (
          <span className="text-white opacity-75 px-3 py-1 rounded bg-gray-700">
            即将上线
          </span>
        ) : (
          <Link 
            to={path} 
            className="inline-flex items-center text-white hover:text-opacity-80"
          >
            {icon === 'jojo' ? '开始测试' : icon === 'tarot' ? '开始占卜' : '进入'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default HomeCard; 