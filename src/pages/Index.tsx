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

          {/* Элегантный демон в центре */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <svg 
              width="300" 
              height="400" 
              viewBox="0 0 300 400" 
              className="animate-pulse"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.8))'
              }}
            >
              {/* Дым/туман вокруг фигуры */}
              <g opacity="0.3" className="animate-pulse">
                <path d="M50 250 Q80 240, 110 250 Q140 260, 170 250 Q200 240, 230 250 Q260 260, 280 250" 
                      stroke="#666" strokeWidth="2" fill="none" className="animate-pulse"/>
                <path d="M40 280 Q70 270, 100 280 Q130 290, 160 280 Q190 270, 220 280 Q250 290, 280 280" 
                      stroke="#666" strokeWidth="1.5" fill="none" className="animate-pulse"/>
                <path d="M60 320 Q90 310, 120 320 Q150 330, 180 320 Q210 310, 240 320" 
                      stroke="#666" strokeWidth="1" fill="none" className="animate-pulse"/>
              </g>

              {/* Основная фигура демона */}
              <g>
                {/* Пламя над головой */}
                <path d="M150 20 Q145 10, 148 5 Q152 8, 155 5 Q158 12, 152 20 Q148 15, 150 20" 
                      fill="#fbbf24" className="animate-bounce">
                  <animate attributeName="fill" values="#fbbf24;#f59e0b;#d97706;#fbbf24" dur="1s" repeatCount="indefinite"/>
                </path>

                {/* Рога */}
                <path d="M120 50 C115 35, 110 25, 105 15 C102 10, 100 8, 98 5" 
                      stroke="#333" strokeWidth="8" fill="none" strokeLinecap="round"/>
                <path d="M180 50 C185 35, 190 25, 195 15 C198 10, 200 8, 202 5" 
                      stroke="#333" strokeWidth="8" fill="none" strokeLinecap="round"/>
                      
                {/* Штрихи на рогах */}
                <g stroke="#222" strokeWidth="1" opacity="0.7">
                  <path d="M108 40 L112 38 M110 35 L114 33 M112 30 L116 28"/>
                  <path d="M192 40 L188 38 M190 35 L186 33 M188 30 L184 28"/>
                </g>

                {/* Голова/морда козла */}
                <ellipse cx="150" cy="65" rx="35" ry="25" fill="#222"/>
                
                {/* Морда */}
                <ellipse cx="150" cy="75" rx="25" ry="15" fill="#333"/>
                
                {/* Глаза (светящиеся) */}
                <circle cx="140" cy="60" r="4" fill="#fbbf24" className="animate-pulse">
                  <animate attributeName="fill" values="#fbbf24;#f59e0b;#fbbf24" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="160" cy="60" r="4" fill="#fbbf24" className="animate-pulse">
                  <animate attributeName="fill" values="#fbbf24;#f59e0b;#fbbf24" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="140" cy="60" r="1.5" fill="#000"/>
                <circle cx="160" cy="60" r="1.5" fill="#000"/>
                
                {/* Ноздри */}
                <ellipse cx="145" cy="75" rx="2" ry="1" fill="#000"/>
                <ellipse cx="155" cy="75" rx="2" ry="1" fill="#000"/>

                {/* Длинное пальто/сюртук */}
                <path d="M110 120 C105 125, 100 280, 105 380 L120 380 L120 320 Q130 310, 150 315 Q170 310, 180 320 L180 380 L195 380 C200 280, 195 125, 190 120 Q150 110, 110 120" 
                      fill="#1a1a1a" stroke="#333" strokeWidth="1"/>
                      
                {/* Лацканы пальто */}
                <path d="M110 120 Q125 115, 135 125 L130 140 Q120 135, 115 140" fill="#0f0f0f"/>
                <path d="M190 120 Q175 115, 165 125 L170 140 Q180 135, 185 140" fill="#0f0f0f"/>

                {/* Жилет */}
                <path d="M125 125 Q150 120, 175 125 L170 180 Q150 175, 130 180 Z" fill="#444"/>
                
                {/* Рубашка */}
                <path d="M130 125 Q150 122, 170 125 L165 160 Q150 157, 135 160 Z" fill="#f8f8f8"/>
                
                {/* Красный галстук */}
                <path d="M145 125 L155 125 L158 160 L152 165 L148 165 L142 160 Z" fill="#dc2626"/>
                <path d="M148 130 L152 130 M148 135 L152 135 M148 140 L152 140" stroke="#991b1b" strokeWidth="0.5"/>

                {/* Пуговицы жилета */}
                <circle cx="150" cy="140" r="2" fill="#666"/>
                <circle cx="150" cy="155" r="2" fill="#666"/>
                <circle cx="150" cy="170" r="2" fill="#666"/>

                {/* Рукава */}
                <ellipse cx="90" cy="160" rx="15" ry="45" fill="#1a1a1a" transform="rotate(-10 90 160)"/>
                <ellipse cx="210" cy="160" rx="15" ry="45" fill="#1a1a1a" transform="rotate(10 210 160)"/>
                
                {/* Манжеты */}
                <ellipse cx="85" cy="195" rx="12" ry="8" fill="#f8f8f8" transform="rotate(-10 85 195)"/>
                <ellipse cx="215" cy="195" rx="12" ry="8" fill="#f8f8f8" transform="rotate(10 215 195)"/>

                {/* Руки/когти */}
                <g fill="#222">
                  <ellipse cx="80" cy="210" rx="8" ry="12" transform="rotate(-15 80 210)"/>
                  <ellipse cx="220" cy="210" rx="8" ry="12" transform="rotate(15 220 210)"/>
                </g>
                
                {/* Когти */}
                <g stroke="#333" strokeWidth="2" fill="none">
                  <path d="M75 215 L70 220 M78 218 L73 223 M81 220 L76 225"/>
                  <path d="M225 215 L230 220 M222 218 L227 223 M219 220 L224 225"/>
                </g>

                {/* Трость/посох в левой руке */}
                <g transform="rotate(-15 80 250)">
                  <line x1="80" y1="210" x2="80" y2="300" stroke="#2d1810" strokeWidth="4"/>
                  <circle cx="80" cy="205" r="5" fill="#fbbf24"/>
                  <path d="M80 200 Q75 195, 80 190 Q85 195, 80 200" fill="#fbbf24"/>
                </g>

                {/* Ноги (козлиные) */}
                <g fill="#222">
                  <ellipse cx="135" cy="350" rx="12" ry="35"/>
                  <ellipse cx="165" cy="350" rx="12" ry="35"/>
                </g>

                {/* Копыта */}
                <g fill="#1a1a1a">
                  <ellipse cx="135" cy="380" rx="10" ry="6"/>
                  <ellipse cx="165" cy="380" rx="10" ry="6"/>
                </g>
                
                {/* Раздвоенные копыта */}
                <g stroke="#000" strokeWidth="1">
                  <line x1="135" y1="375" x2="135" y2="385"/>
                  <line x1="165" y1="375" x2="165" y2="385"/>
                </g>

              </g>
              
              {/* Дополнительные мистические эффекты */}
              <g opacity="0.6" className="animate-pulse">
                <circle cx="100" cy="150" r="3" fill="#fbbf24"/>
                <circle cx="200" cy="180" r="2" fill="#f59e0b"/>
                <circle cx="80" cy="200" r="1.5" fill="#fbbf24"/>
                <circle cx="220" cy="160" r="2.5" fill="#f59e0b"/>
              </g>
            </svg>
          </div>

          {/* Счетчик кликов (поверх демона) */}
          {!showDevil && (
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 translate-y-12 z-20">
              <div className="text-center bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-gray-600">
                <div className="text-2xl font-bold text-white font-['Rubik']">
                  {3 - clickCount}
                </div>
                <div className="text-sm text-gray-300 mt-1">
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