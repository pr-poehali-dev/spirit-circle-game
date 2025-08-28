import { useState, useRef } from 'react';

const Index = () => {
  const [clickCount, setClickCount] = useState(0);
  const [showDevil, setShowDevil] = useState(false);
  const [devilCaught, setDevilCaught] = useState(false);
  const [devilPosition, setDevilPosition] = useState({ x: 50, y: 50 });
  const [isDevilMoving, setIsDevilMoving] = useState(false);
  const circleRef = useRef<HTMLDivElement>(null);

  const alphabet = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');
  const numbers = Array.from({length: 24}, (_, i) => (i + 1).toString());

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
        return 0;
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
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="relative">
        {/* Главный заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 font-['Rubik']" style={{textShadow: '0 0 20px rgba(255,255,255,0.3)'}}>Гадание на Черта</h1>
          <p className="text-gray-400 text-lg">Кликните 3 раза в круг и поймайте черта</p>
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
            {numbers.map((number, index) => {
              const angle = (index / numbers.length) * 360;
              const radius = 220; // меньший радиус для цифр
              const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
              const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
              return (
                <div
                  key={number}
                  className="absolute text-lg font-bold text-gray-600 font-['Rubik']"
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

          {/* Серый черт */}
          {showDevil && (
            <div
              className={`absolute transition-all duration-500 z-10 ${
                !devilCaught && isDevilMoving ? 'animate-pulse' : ''
              } cursor-pointer`}
              onClick={() => {
                if (!devilCaught) {
                  setDevilCaught(true);
                  moveDevil(); // Фиксирует в центре
                }
              }}
              style={{
                left: `${devilPosition.x}%`,
                top: `${devilPosition.y}%`,
                transform: 'translate(-50%, -50%)',
                filter: devilCaught 
                  ? 'drop-shadow(0 0 30px rgba(107,114,128,0.8)) brightness(1.2)' 
                  : 'drop-shadow(0 0 15px rgba(75,85,99,0.6))',
                animation: devilCaught 
                  ? 'devilCaught 1s ease-out' 
                  : !devilCaught && isDevilMoving 
                  ? 'devilRun 0.4s infinite' 
                  : 'devilIdle 2.5s infinite ease-in-out'
              }}
            >
              <div 
                className={`relative ${devilCaught ? 'scale-150' : 'scale-100'} transition-all duration-500 cursor-pointer`}
                onClick={() => !devilCaught && setDevilCaught(true)}
              >
                {/* Точная копия силуэта черта с картинки */}
                <svg 
                  width="200" 
                  height="250" 
                  viewBox="0 0 200 250" 
                  className={`${!devilCaught ? 'animate-pulse' : ''}`}
                  style={{
                    transform: !devilCaught && isDevilMoving ? 'skewX(-3deg)' : 'skewX(0deg)',
                    transition: 'transform 0.2s ease-in-out'
                  }}
                >
                  {/* Точная копия силуэта с картинки - черный силуэт */}
                  <g fill={devilCaught ? '#374151' : '#000000'}>
                    
                    {/* Рога (прямые, как на картинке) */}
                    <path d="M85 15 C85 10, 88 5, 90 0 M115 15 C115 10, 112 5, 110 0"/>
                    
                    {/* Голова в профиль с характерным силуэтом */}
                    <path d="M75 20 C75 15, 78 12, 85 15 C90 18, 95 20, 100 25 C105 30, 108 35, 110 40 C112 45, 115 50, 118 55 C120 60, 118 65, 115 68 C110 70, 105 68, 100 65 C95 62, 90 58, 85 55 C80 52, 75 48, 72 43 C70 38, 70 33, 72 28 C73 25, 74 22, 75 20"/>
                    
                    {/* Туловище наклоненное вперед */}
                    <path d="M100 65 C95 70, 90 75, 88 82 C86 90, 88 98, 92 105 C96 112, 102 118, 108 122 C115 126, 122 128, 130 125 C138 122, 145 115, 148 107 C150 98, 148 88, 145 80 C142 72, 137 65, 130 60 C125 56, 118 55, 112 58 C108 60, 104 62, 100 65"/>
                    
                    {/* Левая рука вытянутая вперед с когтями */}
                    <path className={`${!devilCaught && isDevilMoving ? 'animate-bounce' : ''}`} d="M88 82 C80 78, 70 75, 60 78 C50 82, 42 88, 38 96 C35 104, 38 112, 45 115 C52 118, 60 115, 65 110 C68 108, 70 105, 72 102"/>
                    
                    {/* Пальцы левой руки (когти) */}
                    <path d="M38 96 L30 92 L32 98 M40 94 L32 88 L35 95 M42 98 L35 94 L38 100 M45 102 L38 98 L42 105 M48 106 L42 102 L46 108"/>
                    
                    {/* Правая рука согнутая */}
                    <path className={`${!devilCaught && isDevilMoving ? 'animate-pulse' : ''}`} d="M148 107 C155 110, 162 115, 165 122 C168 130, 165 138, 160 143 C155 148, 148 150, 142 148 C138 146, 135 142, 135 138"/>
                    
                    {/* Левая нога в беге (согнута) */}
                    <path className={`${!devilCaught && isDevilMoving ? 'animate-bounce' : ''}`} d="M92 105 C88 115, 85 125, 88 135 C92 145, 98 152, 105 158 C110 162, 115 165, 118 170 C120 175, 118 180, 115 185"/>
                    
                    {/* Копыто левой ноги */}
                    <ellipse cx="118" cy="190" rx="8" ry="5" transform="rotate(-15 118 190)"/>
                    <path d="M110 188 C112 186, 115 186, 118 188 M118 188 C121 186, 124 186, 126 188"/>
                    
                    {/* Правая нога в беге (вытянута назад) */}
                    <path className={`${!devilCaught && isDevilMoving ? 'animate-pulse' : ''}`} d="M130 125 C135 135, 142 145, 150 152 C158 159, 167 164, 175 167 C183 170, 191 171, 198 169 C205 167, 210 163, 212 157"/>
                    
                    {/* Копыто правой ноги */}
                    <ellipse cx="215" cy="160" rx="8" ry="5" transform="rotate(25 215 160)"/>
                    <path d="M207 158 C209 156, 212 156, 215 158 M215 158 C218 156, 221 156, 223 158"/>
                    
                    {/* Хвост изогнутый назад */}
                    <path 
                      className={`${!devilCaught && isDevilMoving ? 'animate-bounce' : ''}`}
                      d="M148 115 C155 118, 162 122, 168 128 C174 134, 178 142, 180 150 C182 158, 181 166, 178 173 C175 180, 170 186, 163 190 C158 193, 152 194, 147 192"
                      strokeWidth="6" 
                      fill="none" 
                      stroke={devilCaught ? '#374151' : '#000000'}
                      strokeLinecap="round"
                    />
                    
                    {/* Острый кончик хвоста */}
                    <path d="M147 192 L145 198 L152 195 Z"/>
                    
                  </g>
                  
                  {/* Красные светящиеся глаза */}
                  <circle cx="95" cy="35" r="3" fill="#dc2626" className="animate-pulse"/>
                  <circle cx="95" cy="35" r="1.5" fill="#7f1d1d"/>
                  
                  {/* Дополнительные эффекты для пойманного черта */}
                  {devilCaught && (
                    <>
                      <circle cx="95" cy="35" r="8" fill="#dc2626" opacity="0.4" className="animate-ping"/>
                      <circle cx="100" cy="50" r="15" fill="#374151" opacity="0.3" className="animate-pulse"/>
                    </>
                  )}
                </svg>
              </div>
            </div>
          )}

          {/* Игла в центре (когда черт пойман) */}
          {devilCaught && (
            <div 
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl z-20"
              style={{
                filter: 'drop-shadow(0 0 10px silver)'
              }}
            >
              📍
            </div>
          )}

          {/* Счетчик кликов */}
          {!showDevil && (
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600 font-['Rubik']">
                  {3 - clickCount}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {clickCount === 0 && 'Кликните 3 раза'}
                  {clickCount === 1 && 'Еще 2 клика'}
                  {clickCount === 2 && 'Последний клик!'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Результат */}
        {devilCaught && (
          <div className="text-center mt-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-red-400 mb-4 font-['Rubik']">Черт пойман! 🔥</h2>
            <p className="text-white mb-4">Ваше гадание завершено. Игла удерживает духа.</p>
            <button 
              onClick={resetGame}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-['Rubik']"
            >
              Новое гадание
            </button>
          </div>
        )}

        {/* Подсказки */}
        {showDevil && !devilCaught && (
          <div className="text-center mt-6 animate-fade-in">
            <p className="text-red-400 text-lg font-['Rubik']">Черт появился! Поймайте его! 👹</p>
            <button 
              onClick={resetGame}
              className="mt-2 px-4 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
            >
              Начать заново
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;