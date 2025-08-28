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



          {/* Счетчик кликов поверх изображения */}
          {!showDevil && (
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 translate-y-16 z-10">
              <div className="text-center bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="text-xl font-bold text-white font-['Rubik']">
                  {3 - clickCount}
                </div>
                <div className="text-xs text-gray-300">
                  {clickCount === 0 && 'Кликните 3 раза'}
                  {clickCount === 1 && 'Еще 2 клика'}
                  {clickCount === 2 && 'Последний клик!'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Красная стрелка вращающаяся по окружности */}
        <div className="absolute left-1/2 top-1/2 w-0 h-0 transform -translate-x-1/2 -translate-y-1/2">
          <div 
            className="absolute w-0 h-0"
            style={{
              transformOrigin: '0 0',
              animation: 'rotateTail 8s linear infinite'
            }}
          >
            <div
              className="absolute"
              style={{
                left: '-18px',
                top: '-70px',
                color: '#dc2626'
              }}
            >
              <svg width="36" height="30" viewBox="0 0 36 30" fill="none">
                {/* Северная стрелка (красная) */}
                <path d="M18 3 L27 27 L18 22 L9 27 Z" fill="#dc2626" />
                {/* Центральная точка */}
                <circle cx="18" cy="27" r="3" fill="#dc2626" />
              </svg>
            </div>
          </div>
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