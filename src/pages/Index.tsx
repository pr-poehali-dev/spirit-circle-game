import { useState, useRef, useEffect } from 'react';

const Index = () => {
  const [clickCount, setClickCount] = useState(0);
  const [showDevil, setShowDevil] = useState(false);
  const [devilCaught, setDevilCaught] = useState(false);
  const [devilPosition, setDevilPosition] = useState({ x: 50, y: 50 });
  const [isDevilMoving, setIsDevilMoving] = useState(false);
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
              placeholder="Задайте свой вопрос..."
              className="w-96 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300 font-['Rubik']"
              style={{
                backdropFilter: 'blur(10px)',
                textShadow: '0 0 10px rgba(255,255,255,0.3)'
              }}
            />
            <button
              className="px-6 py-3 bg-white/20 border border-white/30 rounded-lg text-white font-bold hover:bg-white/30 hover:border-white/50 transition-all duration-300 font-['Rubik']"
              style={{
                backdropFilter: 'blur(10px)',
                textShadow: '0 0 10px rgba(255,255,255,0.5)'
              }}
            >
              ОК
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
                  animation: 'spin 4s linear infinite'
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
                filter: 'brightness(0.8) contrast(1.5) saturate(0.3) hue-rotate(180deg)',
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
          
          <div className="text-white text-2xl font-bold font-['Rubik'] select-none" style={{textShadow: '0 0 20px rgba(255,255,255,0.5)'}}>
            ДА
          </div>
        </div>






      </div>
    </div>
  );
};

export default Index;