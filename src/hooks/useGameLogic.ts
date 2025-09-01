import { useState, useRef } from 'react';
import { analyzeText, PredictionResult } from '@/components/PredictionLogic';

export const useGameLogic = () => {
  const [clickCount, setClickCount] = useState(0);
  const [showDevil, setShowDevil] = useState(false);
  const [devilCaught, setDevilCaught] = useState(false);
  const [devilPosition, setDevilPosition] = useState({ x: 50, y: 50 });
  const [isDevilMoving, setIsDevilMoving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState('');
  const [arrowSpeed, setArrowSpeed] = useState(4);
  const [shouldStop, setShouldStop] = useState(false);
  const [finalAngle, setFinalAngle] = useState(0);
  const [goldCoins, setGoldCoins] = useState(100); // Начальное количество монет
  const circleRef = useRef<HTMLDivElement>(null);

  const handleCircleClick = (e: React.MouseEvent) => {
    // Если был получен ответ, сбрасываем игру
    if (shouldStop || finalAnswer) {
      resetGame();
      return;
    }

    if (showDevil && !devilCaught) {
      const rect = circleRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const clickX = e.clientX;
        const clickY = e.clientY;
        const distance = Math.sqrt(
          Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2)
        );
        
        // Если кликнули близко к центру где черт
        if (distance < 80) {
          setDevilCaught(true);
          setIsDevilMoving(false);
          return;
        }
        
        // Черт убегает в случайное место
        moveDevil();
      }
      return;
    }

    // Списываем 13 монет за каждое нажатие СРАЗУ
    setGoldCoins(currentCoins => Math.max(0, currentCoins - 13));

    setClickCount(prev => {
      const newCount = prev + 1;
      
      if (newCount >= 3) {
        setShowDevil(true);
        setIsDevilMoving(true);
        moveDevil();
        return newCount; // Сохраняем счетчик для показа стрелки
      }
      return newCount;
    });
  };

  const moveDevil = () => {
    if (devilCaught) {
      // Когда пойман - фиксируется в центре
      setDevilPosition({ x: 50, y: 50 });
      setIsDevilMoving(false);
      return;
    }

    const angle = Math.random() * 2 * Math.PI;
    const radius = 120 + Math.random() * 120; // Увеличил радиус для большего пространства
    const x = 50 + (radius * Math.cos(angle)) / 2.5;
    const y = 50 + (radius * Math.sin(angle)) / 2.5;
    
    setDevilPosition({ 
      x: Math.max(15, Math.min(85, x)), 
      y: Math.max(15, Math.min(85, y)) 
    });
    
    // Черт постоянно движется (более активно)
    setTimeout(() => {
      if (!devilCaught) {
        setIsDevilMoving(true);
        moveDevil();
      }
    }, 800 + Math.random() * 1200); // Уменьшил интервал для более активного движения
  };

  const resetGame = () => {
    setClickCount(0);
    setShowDevil(false);
    setDevilCaught(false);
    setIsDevilMoving(false);
    setIsAnalyzing(false);
    setFinalAnswer('');
    setArrowSpeed(4);
    setShouldStop(false);
    setFinalAngle(0);
  };

  const handlePrediction = (inputText: string) => {
    if (!inputText.trim()) return;
    
    // Если еще не кликали 3 раза, активируем стрелку
    if (clickCount < 3) {
      setClickCount(3);
      setShowDevil(true);
      setIsDevilMoving(true);
      moveDevil();
    }
    
    // Списываем 13 монет за гадание
    setGoldCoins(currentCoins => Math.max(0, currentCoins - 13));
    
    setIsAnalyzing(true);
    setShouldStop(false);
    
    // Анализируем текст
    const result = analyzeText(inputText);
    
    // Случайное время вращения от 2 до 7 секунд
    const spinTime = 2000 + Math.random() * 5000;
    
    // Постепенное замедление стрелки
    let currentSpeed = 4;
    const slowDownInterval = setInterval(() => {
      currentSpeed *= 0.95; // Замедление на 5% каждые 100мс
      setArrowSpeed(currentSpeed);
      
      if (currentSpeed < 0.1) {
        clearInterval(slowDownInterval);
        setShouldStop(true);
        setFinalAnswer(result.value);
        setIsAnalyzing(false);
      }
    }, 100);
    
    // Остановка через заданное время
    setTimeout(() => {
      clearInterval(slowDownInterval);
      setFinalAngle(result.angle);
      setShouldStop(true);
      setFinalAnswer(result.value);
      setIsAnalyzing(false);
    }, spinTime);
  };

  return {
    clickCount,
    showDevil,
    devilCaught,
    devilPosition,
    isDevilMoving,
    isAnalyzing,
    finalAnswer,
    arrowSpeed,
    shouldStop,
    finalAngle,
    goldCoins,
    circleRef,
    handleCircleClick,
    moveDevil,
    resetGame,
    handlePrediction
  };
};