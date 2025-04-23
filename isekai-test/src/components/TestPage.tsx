import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getQuestions } from '../data/questions';

interface TestPageProps {
  section: string;
  onAnswer: (answer: any) => void;
}

const TestPage: React.FC<TestPageProps> = ({ section, onAnswer }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 获取对应部分的问题
  useEffect(() => {
    const fetchQuestions = () => {
      setIsLoading(true);
      // 使用模拟数据
      const sectionQuestions = getQuestions(section);
      setQuestions(sectionQuestions);
      setIsLoading(false);
    };

    fetchQuestions();
  }, [section]);

  // 处理选择回答
  const handleOptionSelect = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      // 进入下一题
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 完成本部分测试
      onAnswer(newAnswers);
    }
  };

  // 获取当前部分的主题样式
  const getSectionTheme = () => {
    switch (section) {
      case 'personality':
        return 'scifi-theme';
      case 'world':
        return 'fantasy-theme';
      case 'talent':
        return 'ancient-theme';
      case 'destiny':
        return 'horror-theme';
      default:
        return 'modern-theme';
    }
  };

  // 获取当前部分标题
  const getSectionTitle = () => {
    switch (section) {
      case 'personality':
        return '性格测试';
      case 'world':
        return '世界选择';
      case 'talent':
        return '能力觉醒';
      case 'destiny':
        return '命运走向';
      default:
        return '多维测试';
    }
  };

  if (isLoading) {
    return (
      <div className={`page-container ${getSectionTheme()}`}>
        <div className="loading-container">
          <div className="text-2xl mb-4">加载中...</div>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <motion.div 
      className={`page-container ${getSectionTheme()}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="test-container">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">{getSectionTitle()} - 问题 {currentQuestionIndex + 1}/{questions.length}</h2>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <motion.div
          key={currentQuestionIndex}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-xl mb-6">{currentQuestion.question}</h3>
          <div className="space-y-3">
            {currentQuestion.options.map((option: string, index: number) => (
              <motion.button
                key={index}
                className="option-button bg-opacity-20 bg-white hover:bg-opacity-30"
                onClick={() => handleOptionSelect(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TestPage; 