import { useState, useRef, useEffect } from 'react';

const Index = () => {
  const [clickCount, setClickCount] = useState(0);
  const [showDevil, setShowDevil] = useState(false);
  const [devilCaught, setDevilCaught] = useState(false);
  const [devilPosition, setDevilPosition] = useState({ x: 50, y: 50 });
  const [isDevilMoving, setIsDevilMoving] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState('');
  const [arrowSpeed, setArrowSpeed] = useState(4);
  const [shouldStop, setShouldStop] = useState(false);
  const [finalAngle, setFinalAngle] = useState(0);
  const circleRef = useRef<HTMLDivElement>(null);

  const alphabet = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const hourNumbers = Array.from({length: 12}, (_, i) => (i + 1).toString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCircleClick = (e: React.MouseEvent) => {
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
    setInputText('');
    setIsAnalyzing(false);
    setFinalAnswer('');
    setArrowSpeed(4);
    setShouldStop(false);
    setFinalAngle(0);
  };

  // Алгоритм анализа текста для предсказаний
  const analyzeText = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Подсчет различных характеристик текста
    const vowels = (text.match(/[аеиоуыэюя]/gi) || []).length;
    const consonants = (text.match(/[бвгджзйклмнпрстфхцчшщ]/gi) || []).length;
    const textLength = text.length;
    const wordsCount = text.trim().split(/\s+/).length;
    
    // Определение типа вопроса и генерация результата
    const isYesNoQuestion = /\b(ли|да|нет|будет|стоит|можно|нужно)\b/.test(lowerText) || 
                          text.includes('?');
    
    const isNumberQuestion = /\b(сколько|когда|во сколько|через|лет|дней|месяцев)\b/.test(lowerText);
    
    const isLetterQuestion = /\b(буква|имя|название|как зовут|начинается)\b/.test(lowerText);
    
    // Базовый расчет на основе характеристик текста
    const baseValue = (vowels * 7 + consonants * 3 + textLength * 2 + wordsCount * 5) % 100;
    
    if (isYesNoQuestion) {
      // Сложный алгоритм для максимально неодинаковых ответов
      
      // 1. Анализ содержания вопроса
      const positiveWords = /\b(хорошо|удача|счастье|любовь|радость|успех|можно|стоит|получится|везет|выйду|замуж|женюсь|поможет|сбудется)\b/i.test(lowerText);
      const negativeWords = /\b(плохо|беда|проблема|болезнь|грусть|неудача|нельзя|опасно|провал|боль|умру|разведусь|потеряю|обманут)\b/i.test(lowerText);
      const uncertainWords = /\b(может|возможно|наверное|кажется|думаю|сомневаюсь|не знаю)\b/i.test(lowerText);
      
      // 2. Анализ типа вопроса
      const aboutLove = /\b(любовь|любит|отношения|свадьба|замуж|парень|девушка|муж|жена)\b/i.test(lowerText);
      const aboutMoney = /\b(деньги|работа|зарплата|богатство|купить|продать|бизнес)\b/i.test(lowerText);
      const aboutHealth = /\b(здоровье|болезнь|лечение|врач|больница|лекарство)\b/i.test(lowerText);
      const aboutFuture = /\b(будет|станет|произойдет|случится|через|скоро|завтра|год)\b/i.test(lowerText);
      
      // 3. Уникальный хеш вопроса для стабильности ответа на одинаковые вопросы
      let questionHash = 0;
      for (let i = 0; i < text.length; i++) {
        questionHash = ((questionHash << 5) - questionHash + text.charCodeAt(i)) & 0x7fffffff;
      }
      const stableRandom = (questionHash % 100);
      
      // 4. Базовая вероятность зависит от типа вопроса
      let yesThreshold = 50;
      
      // Тематические корректировки
      if (aboutLove) yesThreshold = 65; // Любовь чаще положительна
      if (aboutMoney) yesThreshold = 45; // Деньги сложнее получить
      if (aboutHealth) yesThreshold = uncertainWords ? 40 : 60; // Здоровье зависит от уверенности
      if (aboutFuture) yesThreshold = 55; // Будущее слегка оптимистично
      
      // Тональные корректировки
      if (positiveWords && !negativeWords) yesThreshold += 20;
      if (negativeWords && !positiveWords) yesThreshold -= 25;
      if (uncertainWords) yesThreshold -= 10;
      
      // Структурные корректировки
      if (textLength > 60) yesThreshold -= 15; // Длинные вопросы = больше сомнений
      if (textLength < 15) yesThreshold += 10; // Короткие = быстрые решения
      if (wordsCount === 1) yesThreshold += 15; // Одно слово = прямой ответ
      
      // Временные корректировки
      const hour = new Date().getHours();
      const day = new Date().getDay();
      if (hour >= 6 && hour <= 10) yesThreshold += 8; // Утренний оптимизм
      if (hour >= 22 || hour <= 5) yesThreshold -= 12; // Ночные сомнения
      if (day === 1) yesThreshold -= 5; // Понедельник более пессимистичен
      if (day === 5 || day === 6) yesThreshold += 5; // Пятница/суббота более позитивны
      
      // Числовые характеристики текста
      if (vowels > consonants) yesThreshold += 5; // Больше гласных = мелодичнее = позитивнее
      if (text.includes('?')) yesThreshold -= 3; // Вопросительный знак = больше сомнений
      if (text.includes('!')) yesThreshold += 8; // Восклицательный = больше энергии
      
      // Финальное решение на основе стабильного хеша
      const isYes = stableRandom < Math.max(10, Math.min(90, yesThreshold));
      
      return {
        type: 'yesno',
        value: isYes ? 'ДА' : 'НЕТ',
        angle: isYes ? 90 : 270 // ДА направо (90°), НЕТ налево (270°)
      };
    } else if (isNumberQuestion) {
      const number = (baseValue % 12) + 1;
      return {
        type: 'number',
        value: number.toString(),
        angle: (number - 1) * 30 // Позиция числа на циферблате
      };
    } else if (isLetterQuestion) {
      const letterIndex = baseValue % alphabet.length;
      return {
        type: 'letter',
        value: alphabet[letterIndex],
        angle: (letterIndex / alphabet.length) * 360 // Позиция буквы
      };
    } else {
      // По умолчанию - тот же сложный алгоритм
      const positiveWords = /\b(хорошо|удача|счастье|любовь|радость|успех|можно|стоит|получится|везет|выйду|замуж|женюсь|поможет|сбудется)\b/i.test(lowerText);
      const negativeWords = /\b(плохо|беда|проблема|болезнь|грусть|неудача|нельзя|опасно|провал|боль|умру|разведусь|потеряю|обманут)\b/i.test(lowerText);
      const uncertainWords = /\b(может|возможно|наверное|кажется|думаю|сомневаюсь|не знаю)\b/i.test(lowerText);
      
      const aboutLove = /\b(любовь|любит|отношения|свадьба|замуж|парень|девушка|муж|жена)\b/i.test(lowerText);
      const aboutMoney = /\b(деньги|работа|зарплата|богатство|купить|продать|бизнес)\b/i.test(lowerText);
      const aboutHealth = /\b(здоровье|болезнь|лечение|врач|больница|лекарство)\b/i.test(lowerText);
      const aboutFuture = /\b(будет|станет|произойдет|случится|через|скоро|завтра|год)\b/i.test(lowerText);
      
      let questionHash = 0;
      for (let i = 0; i < text.length; i++) {
        questionHash = ((questionHash << 5) - questionHash + text.charCodeAt(i)) & 0x7fffffff;
      }
      const stableRandom = (questionHash % 100);
      
      let yesThreshold = 50;
      
      if (aboutLove) yesThreshold = 65;
      if (aboutMoney) yesThreshold = 45;
      if (aboutHealth) yesThreshold = uncertainWords ? 40 : 60;
      if (aboutFuture) yesThreshold = 55;
      
      if (positiveWords && !negativeWords) yesThreshold += 20;
      if (negativeWords && !positiveWords) yesThreshold -= 25;
      if (uncertainWords) yesThreshold -= 10;
      
      if (textLength > 60) yesThreshold -= 15;
      if (textLength < 15) yesThreshold += 10;
      if (wordsCount === 1) yesThreshold += 15;
      
      const hour = new Date().getHours();
      const day = new Date().getDay();
      if (hour >= 6 && hour <= 10) yesThreshold += 8;
      if (hour >= 22 || hour <= 5) yesThreshold -= 12;
      if (day === 1) yesThreshold -= 5;
      if (day === 5 || day === 6) yesThreshold += 5;
      
      if (vowels > consonants) yesThreshold += 5;
      if (text.includes('?')) yesThreshold -= 3;
      if (text.includes('!')) yesThreshold += 8;
      
      const isYes = stableRandom < Math.max(10, Math.min(90, yesThreshold));
      
      return {
        type: 'yesno',
        value: isYes ? 'ДА' : 'НЕТ',
        angle: isYes ? 90 : 270
      };
    }
  };

  const handlePrediction = () => {
    if (!inputText.trim()) return;
    
    // Если еще не кликали 3 раза, активируем стрелку
    if (clickCount < 3) {
      setClickCount(3);
      setShowDevil(true);
      setIsDevilMoving(true);
      moveDevil();
    }
    
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

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden">
      <div className="relative overflow-hidden">
        {/* Главный заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 font-['Rubik']" style={{textShadow: '0 0 20px rgba(255,255,255,0.3)'}}>Гадание на Черта</h1>
          <p className="text-gray-400 text-lg">Кликните 3 раза в круг и поймайте черта</p>
        </div>

        {/* Окно ввода текста */}
        <div className="mb-4">
          <div className="flex justify-center items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Задайте свой вопрос..."
              className="w-96 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300 font-['Rubik']"
              style={{
                backdropFilter: 'blur(10px)',
                textShadow: '0 0 10px rgba(255,255,255,0.3)'
              }}
              onKeyDown={(e) => e.key === 'Enter' && handlePrediction()}
              disabled={isAnalyzing}
            />
            <button
              onClick={handlePrediction}
              disabled={!inputText.trim() || isAnalyzing}
              className="px-6 py-3 bg-white/20 border border-white/30 rounded-lg text-white font-bold hover:bg-white/30 hover:border-white/50 transition-all duration-300 font-['Rubik'] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backdropFilter: 'blur(10px)',
                textShadow: '0 0 10px rgba(255,255,255,0.5)'
              }}
            >
              {isAnalyzing ? 'Гадаю...' : 'ОК'}
            </button>
          </div>
        </div>

        {/* Надписи ДА и НЕТ */}
        <div className="flex items-center justify-center gap-8">
          <div className="text-white text-2xl font-bold font-['Rubik'] select-none" style={{textShadow: '0 0 20px rgba(255,255,255,0.5)'}}>
            НЕТ
          </div>
          
          {/* Основной круг */}
          <div 
            ref={circleRef}
            className="relative w-[648px] h-[648px] bg-white rounded-full cursor-pointer select-none shadow-[0_0_50px_rgba(255,255,255,0.3)] border-2 border-black" 
            onClick={handleCircleClick}
            style={{
              background: devilCaught 
              ? 'radial-gradient(circle, #ffffff 0%, #f0f0f0 100%)' 
              : 'white'
          }}
        >
          {/* Алфавит по границе круга */}
          <div 
            className="absolute inset-0 overflow-hidden rounded-full"
            style={{
              animation: 'spin 20s linear infinite'
            }}
          >
            {alphabet.map((letter, index) => {
              const angle = (index / alphabet.length) * 360;
              const radius = 300; // радиус для позиционирования букв
              const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
              const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
              return (
                <div
                  key={letter}
                  className="absolute text-xl font-bold text-black font-['Rubik']"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                    transformOrigin: 'center'
                  }}
                >
                  {letter}
                </div>
              );
            })}
          </div>

          {/* Цифры по внутреннему диаметру */}
          <div 
            className="absolute inset-0 overflow-hidden rounded-full"
            style={{
              animation: 'spin 15s linear infinite reverse'
            }}
          >
            {hourNumbers.map((number, index) => {
              const angle = (index / hourNumbers.length) * 360;
              const radius = 220;
              const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
              const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
              return (
                <div
                  key={number}
                  className="absolute text-xl font-bold text-black font-['Rubik']"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                    transformOrigin: 'center'
                  }}
                >
                  {number}
                </div>
              );
            })}

          </div>



          {/* Красная стрелка часов после 3 кликов */}
          {clickCount >= 3 && (
            <div className="absolute left-1/2 top-1/2 w-0 h-0 transform -translate-x-1/2 -translate-y-1/2 z-30">
              <div 
                className="absolute w-0 h-0"
                style={{
                  transformOrigin: '0 0',
                  animation: shouldStop ? 'none' : `spin ${arrowSpeed}s linear infinite`,
                  transform: shouldStop ? `rotate(${finalAngle}deg)` : undefined
                }}
              >
                <div
                  className="absolute z-30"
                  style={{
                    left: '-1px',
                    top: '-240px',
                    width: '2px',
                    height: '240px',
                    backgroundColor: '#dc2626',
                    borderRadius: '1px',
                    boxShadow: '0 0 8px rgba(220, 38, 38, 0.6)'
                  }}
                />
                {/* Указатель на конце стрелки */}
                <div
                  className="absolute z-30"
                  style={{
                    left: '-6px',
                    top: '-250px',
                    width: '0',
                    height: '0',
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderBottom: '15px solid #dc2626',
                    filter: 'drop-shadow(0 0 8px rgba(220, 38, 38, 0.6))'
                  }}
                />
                {/* Центральная точка */}
                <div
                  className="absolute z-30"
                  style={{
                    left: '-4px',
                    top: '-4px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#dc2626',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px rgba(220, 38, 38, 0.8)'
                  }}
                />
              </div>
            </div>
          )}






          {/* Изображение демона в центре */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img 
              src="https://cdn.poehali.dev/files/b4926a70-212f-40ee-bd79-c4e60158e320.jpg" 
              alt="Демон"
              className="w-80 h-96 object-contain opacity-80 animate-pulse"
              style={{ 
                filter: 'brightness(1.2) contrast(1.3)',
                mixBlendMode: 'multiply',
                animation: 'sway 3s ease-in-out infinite'
              }}
            />
          </div>




        </div>
          
          <div className="text-white text-2xl font-bold font-['Rubik'] select-none" style={{textShadow: '0 0 20px rgba(255,255,255,0.5)'}}>
            ДА
          </div>
        </div>






        {/* Результат предсказания */}
        {finalAnswer && (
          <div className="text-center mt-6">
            <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg shadow-lg">
              <div className="text-sm text-gray-200 mb-1">Ответ:</div>
              <div className="text-3xl font-bold font-['Rubik']" style={{textShadow: '0 0 15px rgba(255,255,255,0.7)'}}>
                {finalAnswer}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Index;