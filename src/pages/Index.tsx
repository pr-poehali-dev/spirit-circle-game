import { useState, useRef } from 'react';

const Index = () => {
  const [clickCount, setClickCount] = useState(0);
  const [showDevil, setShowDevil] = useState(false);
  const [devilCaught, setDevilCaught] = useState(false);
  const [devilPosition, setDevilPosition] = useState({ x: 50, y: 50 });
  const [isDevilMoving, setIsDevilMoving] = useState(false);
  const circleRef = useRef<HTMLDivElement>(null);

  const alphabet = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');
  const numbers = '0123456789'.split('');

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
          className="relative w-[688px] h-[688px] bg-white rounded-full cursor-pointer select-none shadow-[0_0_50px_rgba(255,255,255,0.3)] border-2 border-black" 
          onClick={handleCircleClick}
          style={{
            background: devilCaught 
              ? 'radial-gradient(circle, #ffffff 0%, #f0f0f0 100%)' 
              : 'white'
          }}
        >
          {/* Алфавит по границе круга */}
          <div className="absolute inset-0">
            {alphabet.map((letter, index) => {
              const angle = (index / alphabet.length) * 360;
              const radius = 320; // радиус для позиционирования букв
              return (
                <div
                  key={letter}
                  className="absolute text-xl font-bold text-black font-['Rubik']"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${angle}deg) translateY(-${radius}px) rotate(${angle}deg)`,
                    transformOrigin: '0 0'
                  }}
                >
                  {letter}
                </div>
              );
            })}
          </div>

          {/* Черт */}
          {showDevil && (
            <div
              className={`absolute text-6xl transition-all duration-500 z-10 ${
                isDevilMoving ? 'animate-bounce' : ''
              } ${devilCaught ? 'text-8xl' : ''}`}
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
                  ? 'bounce 1s infinite' 
                  : 'none'
              }}
            >
              😈
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