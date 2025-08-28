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
    const angle = Math.random() * 2 * Math.PI;
    const radius = 160 + Math.random() * 80; // Случайное расстояние от центра
    const x = 50 + (radius * Math.cos(angle)) / 2;
    const y = 50 + (radius * Math.sin(angle)) / 2;
    
    setDevilPosition({ 
      x: Math.max(10, Math.min(90, x)), 
      y: Math.max(10, Math.min(90, y)) 
    });
    
    setTimeout(() => {
      if (!devilCaught) {
        moveDevil();
      }
    }, 1000 + Math.random() * 2000);
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

          {/* Реалистичный черт */}
          {showDevil && (
            <div
              className={`absolute transition-all duration-300 z-10 ${
                isDevilMoving ? 'animate-pulse' : ''
              }`}
              style={{
                left: `${devilPosition.x}%`,
                top: `${devilPosition.y}%`,
                transform: 'translate(-50%, -50%)',
                filter: devilCaught 
                  ? 'drop-shadow(0 0 20px red)' 
                  : 'drop-shadow(0 0 10px rgba(255,0,0,0.5))',
                animation: devilCaught 
                  ? 'none' 
                  : isDevilMoving 
                  ? 'devilRun 0.5s infinite' 
                  : 'devilIdle 2s infinite'
              }}
            >
              <div className={`relative ${devilCaught ? 'scale-125' : 'scale-100'} transition-all duration-500`}>
                {/* SVG силуэт черта в динамичной позе */}
                <svg 
                  width="60" 
                  height="80" 
                  viewBox="0 0 60 80" 
                  className={`${isDevilMoving ? 'animate-pulse' : ''}`}
                  style={{
                    transform: isDevilMoving ? 'skewX(-5deg)' : 'skewX(0deg)',
                    transition: 'transform 0.2s ease-in-out'
                  }}
                >
                  {/* Основной силуэт черта */}
                  <g fill={devilCaught ? '#dc2626' : '#991b1b'} stroke={devilCaught ? '#fef2f2' : 'none'} strokeWidth="1">
                    
                    {/* Рога */}
                    <path d="M25 8 L20 2 M35 8 L40 2" stroke="#4a5568" strokeWidth="3" fill="none" strokeLinecap="round"/>
                    <path d="M22 10 L18 4 M38 10 L42 4" stroke="#4a5568" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    
                    {/* Голова с заостренными ушами */}
                    <ellipse cx="30" cy="15" rx="12" ry="10"/>
                    <path d="M18 12 L15 8 L20 10 Z"/>
                    <path d="M42 12 L45 8 L40 10 Z"/>
                    
                    {/* Глаза (светящиеся) */}
                    <circle cx="25" cy="13" r="2" fill={devilCaught ? '#fbbf24' : '#f59e0b'} className="animate-pulse"/>
                    <circle cx="35" cy="13" r="2" fill={devilCaught ? '#fbbf24' : '#f59e0b'} className="animate-pulse"/>
                    <circle cx="25" cy="13" r="0.5" fill="#000"/>
                    <circle cx="35" cy="13" r="0.5" fill="#000"/>
                    
                    {/* Нос/морда */}
                    <path d="M30 16 L28 20 L32 20 Z"/>
                    
                    {/* Туловище (изогнутый, динамичный) */}
                    <path d="M20 25 Q15 35 18 45 Q20 55 25 50 Q35 52 40 45 Q45 35 40 25 Q35 20 30 22 Q25 20 20 25 Z"/>
                    
                    {/* Левая рука (вытянутая вперед, как на силуэте) */}
                    <path className={`${isDevilMoving ? 'animate-bounce' : ''}`} d="M18 35 Q10 30 5 35 Q8 38 12 36 L15 40 Q18 38 16 35"/>
                    <path d="M8 35 L3 33 M8 37 L3 39 M10 39 L5 42" stroke="#4a5568" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    
                    {/* Правая рука (согнутая) */}
                    <path className={`${isDevilMoving ? 'animate-pulse' : ''}`} d="M42 35 Q48 32 52 38 Q50 42 45 40 L42 38"/>
                    <path d="M48 38 L52 35 M48 40 L52 42" stroke="#4a5568" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    
                    {/* Левая нога (в прыжке) */}
                    <path className={`${isDevilMoving ? 'animate-bounce' : ''}`} d="M22 50 Q18 60 20 70 Q22 72 25 70 L28 68 Q30 70 28 72"/>
                    <ellipse cx="28" cy="75" rx="4" ry="2" fill="#1f2937"/>
                    
                    {/* Правая нога (согнута) */}
                    <path className={`${isDevilMoving ? 'animate-pulse' : ''}`} d="M38 50 Q42 58 40 65 Q38 67 35 65 L32 63 Q30 65 32 67"/>
                    <ellipse cx="32" cy="70" rx="4" ry="2" fill="#1f2937"/>
                    
                    {/* Хвост (S-образный, как на картинке) */}
                    <path 
                      className={`${isDevilMoving ? 'animate-bounce' : ''}`}
                      d="M40 45 Q50 48 52 55 Q54 62 48 65 Q42 68 45 75"
                      stroke={devilCaught ? '#dc2626' : '#991b1b'} 
                      strokeWidth="4" 
                      fill="none" 
                      strokeLinecap="round"
                    />
                    <path d="M44 74 L46 78 L42 76 Z" fill={devilCaught ? '#dc2626' : '#991b1b'}/>
                    
                  </g>
                  
                  {/* Дополнительные эффекты для пойманного черта */}
                  {devilCaught && (
                    <>
                      <circle cx="25" cy="13" r="4" fill="#fbbf24" opacity="0.6" className="animate-ping"/>
                      <circle cx="35" cy="13" r="4" fill="#fbbf24" opacity="0.6" className="animate-ping"/>
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