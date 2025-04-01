import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Button, Modal, Typography, Progress, notification } from 'antd';
import { 
  RocketOutlined, 
  StarOutlined, 
  TrophyOutlined,
  ReloadOutlined 
} from '@ant-design/icons';
import { DailyFortune } from '../types/fortune';

const { Title, Text } = Typography;

interface FortuneGameProps {
  visible: boolean;
  onClose: () => void;
  dailyFortune?: DailyFortune;
}

const GameModal = styled(Modal)`
  .ant-modal-content {
    background: rgba(20, 20, 40, 0.9);
    border-radius: 20px;
    backdrop-filter: blur(10px);
  }
  
  .ant-modal-header {
    background: transparent;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .ant-modal-title {
    color: #ffd700;
  }
  
  .ant-modal-close {
    color: #ffd700;
  }
`;

const GameContainer = styled.div`
  padding: 20px;
  color: white;
`;

const GameCanvas = styled.canvas`
  border: 1px solid rgba(255, 215, 0, 0.5);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.5);
  margin: 20px 0;
  cursor: pointer;
`;

const GameControls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 10px;
`;

const GameButton = styled(Button)`
  background: linear-gradient(45deg, #6941C6, #3730A3);
  border: none;
  color: white;
  flex: 1;
  height: 40px;
  
  &:hover {
    opacity: 0.9;
    background: linear-gradient(45deg, #6941C6, #3730A3);
    color: white;
  }
  
  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.5);
  }
`;

const GameBoost = styled.div`
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
  padding: 10px 15px;
  margin-bottom: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BoostBadge = styled.div`
  background: linear-gradient(45deg, #FFA500, #FF6B6B);
  border-radius: 20px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: bold;
  color: white;
`;

const FortuneGame: React.FC<FortuneGameProps> = ({ visible, onClose, dailyFortune }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [boost, setBoost] = useState({ type: '', value: 1 });
  const [highScore, setHighScore] = useState(0);
  
  // 游戏状态
  const gameStateRef = useRef({
    targets: [] as { x: number, y: number, radius: number, speed: number, color: string }[],
    particles: [] as { x: number, y: number, vx: number, vy: number, radius: number, color: string, life: number }[],
    player: { x: 0, y: 0 },
    animationId: 0,
    lastSpawn: 0,
    targetCount: 0
  });
  
  // 初始化游戏设置
  useEffect(() => {
    if (visible && dailyFortune) {
      // 根据运势设置游戏加成
      let boostType = '';
      let boostValue = 1;
      
      // 根据运势类别设定游戏加成
      if (dailyFortune.categories.game && dailyFortune.categories.game.level) {
        switch (dailyFortune.categories.game.level) {
          case 'SSR':
            boostType = '游戏运超强';
            boostValue = 2.0;
            break;
          case 'SR':
            boostType = '游戏运良好';
            boostValue = 1.5;
            break;
          case 'R':
            boostType = '游戏运一般';
            boostValue = 1.2;
            break;
          default:
            boostType = '普通游戏运';
            boostValue = 1.0;
        }
      }
      
      setBoost({ type: boostType, value: boostValue });
      
      // 加载历史最高分
      const savedHighScore = localStorage.getItem('fortune-game-highscore');
      if (savedHighScore) {
        setHighScore(parseInt(savedHighScore));
      }
    }
  }, [visible, dailyFortune]);
  
  // 处理游戏循环
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    
    if (gameActive && !gameOver) {
      // 倒计时
      timerId = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [gameActive, gameOver]);
  
  // 游戏主循环
  useEffect(() => {
    if (!gameActive || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 初始化画布尺寸
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    
    resizeCanvas();
    
    // 鼠标移动处理
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      gameStateRef.current.player.x = e.clientX - rect.left;
      gameStateRef.current.player.y = e.clientY - rect.top;
    };
    
    // 触摸移动处理
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      gameStateRef.current.player.x = e.touches[0].clientX - rect.left;
      gameStateRef.current.player.y = e.touches[0].clientY - rect.top;
    };
    
    // 点击/触摸处理
    const handleClick = () => {
      const { player, targets } = gameStateRef.current;
      
      // 检查是否点击到目标
      for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        const dx = player.x - target.x;
        const dy = player.y - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < target.radius) {
          // 击中目标
          targets.splice(i, 1);
          
          // 添加粒子效果
          for (let j = 0; j < 10; j++) {
            gameStateRef.current.particles.push({
              x: target.x,
              y: target.y,
              vx: (Math.random() - 0.5) * 5,
              vy: (Math.random() - 0.5) * 5,
              radius: Math.random() * 3 + 1,
              color: target.color,
              life: 30
            });
          }
          
          // 加分 (带运势加成)
          setScore(prev => {
            const newScore = prev + Math.round(10 * boost.value);
            return newScore;
          });
          
          gameStateRef.current.targetCount++;
          break;
        }
      }
    };
    
    // 绘制游戏状态
    const draw = () => {
      const { targets, particles, player } = gameStateRef.current;
      
      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 绘制背景
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 绘制粒子
      particles.forEach((particle, i) => {
        ctx.globalAlpha = particle.life / 30;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 更新粒子
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        
        // 移除死亡粒子
        if (particle.life <= 0) {
          particles.splice(i, 1);
        }
      });
      
      ctx.globalAlpha = 1;
      
      // 绘制目标
      targets.forEach(target => {
        ctx.fillStyle = target.color;
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 发光效果
        ctx.shadowBlur = 10;
        ctx.shadowColor = target.color;
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // 更新目标位置
        target.y += target.speed;
        
        // 如果目标移出屏幕，从数组中移除
        if (target.y > canvas.height + target.radius) {
          const index = targets.indexOf(target);
          if (index !== -1) {
            targets.splice(index, 1);
          }
        }
      });
      
      // 绘制玩家光标
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(player.x, player.y, 10, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(player.x, player.y, 14, 0, Math.PI * 2);
      ctx.stroke();
      
      // 生成新目标
      const now = Date.now();
      if (now - gameStateRef.current.lastSpawn > 800 - Math.min(gameStateRef.current.targetCount * 10, 500)) {
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#FF9F1C'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        targets.push({
          x: Math.random() * canvas.width,
          y: -20,
          radius: Math.random() * 15 + 15,
          speed: Math.random() * 2 + 1,
          color: randomColor
        });
        
        gameStateRef.current.lastSpawn = now;
      }
      
      // 继续动画
      gameStateRef.current.animationId = requestAnimationFrame(draw);
    };
    
    // 添加事件监听
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('mousedown', handleClick);
    canvas.addEventListener('touchstart', handleClick);
    window.addEventListener('resize', resizeCanvas);
    
    // 开始游戏循环
    gameStateRef.current = {
      targets: [],
      particles: [],
      player: { x: canvas.width / 2, y: canvas.height / 2 },
      animationId: requestAnimationFrame(draw),
      lastSpawn: Date.now(),
      targetCount: 0
    };
    
    // 清理函数
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('mousedown', handleClick);
      canvas.removeEventListener('touchstart', handleClick);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(gameStateRef.current.animationId);
    };
  }, [gameActive, boost.value]);
  
  // 开始游戏
  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
  };
  
  // 结束游戏
  const endGame = () => {
    setGameActive(false);
    setGameOver(true);
    
    // 更新最高分
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('fortune-game-highscore', score.toString());
      
      // 如果有新的最高分记录，奖励金豆
      const currentCoins = parseInt(localStorage.getItem('fortune-coins') || '0');
      const reward = Math.ceil(score / 10);
      localStorage.setItem('fortune-coins', (currentCoins + reward).toString());
      
      notification.success({
        message: '新纪录！',
        description: `恭喜获得新的最高分记录！奖励${reward}金豆`,
        placement: 'topRight'
      });
    }
  };
  
  return (
    <GameModal
      title={<><RocketOutlined /> 今日运势小游戏</>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
    >
      <GameContainer>
        <GameBoost>
          <div>今日游戏运势: {boost.type}</div>
          <BoostBadge>得分 x{boost.value.toFixed(1)}</BoostBadge>
        </GameBoost>
        
        {gameActive ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <Text style={{ color: '#ffd700' }}>
                <StarOutlined /> 得分: {score}
              </Text>
              <Text style={{ color: 'white' }}>
                剩余时间: {timeLeft}秒
              </Text>
            </div>
            <Progress 
              percent={(timeLeft / 30) * 100} 
              showInfo={false} 
              strokeColor="#ffd700"
              trailColor="rgba(255,255,255,0.1)"
            />
          </>
        ) : (
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            {gameOver ? (
              <>
                <Title level={3} style={{ color: '#ffd700', margin: '10px 0' }}>
                  游戏结束
                </Title>
                <div style={{ fontSize: '40px', marginBottom: '15px' }}>
                  {score}
                </div>
                <div>
                  <TrophyOutlined style={{ color: '#ffd700', marginRight: '5px' }} />
                  最高记录: {highScore}
                </div>
              </>
            ) : (
              <>
                <Title level={4} style={{ color: '#ffd700' }}>点击彩色气泡获得分数</Title>
                <Text style={{ color: 'white' }}>运势越好，得分加成越高！</Text>
              </>
            )}
          </div>
        )}
        
        <GameCanvas ref={canvasRef} width={460} height={300} />
        
        <GameControls>
          {gameActive ? (
            <GameButton 
              onClick={endGame}
              icon={<ReloadOutlined />}
            >
              结束游戏
            </GameButton>
          ) : (
            <GameButton 
              onClick={startGame}
              icon={<RocketOutlined />}
            >
              {gameOver ? '再来一次' : '开始游戏'}
            </GameButton>
          )}
        </GameControls>
      </GameContainer>
    </GameModal>
  );
};

export default FortuneGame; 