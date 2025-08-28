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
              width="280" 
              height="380" 
              viewBox="0 0 280 380" 
              style={{
                filter: 'drop-shadow(0 0 25px rgba(0,0,0,0.6))'
              }}
            >
              {/* Точная копия демона с картинки */}
              
              {/* Дым вокруг фигуры - как на картинке */}
              <g opacity="0.4" fill="none" stroke="#999" strokeWidth="1.5" className="animate-pulse">
                <path d="M40 200 Q60 190, 80 200 Q100 210, 120 200 Q140 190, 160 200"/>
                <path d="M120 210 Q140 200, 160 210 Q180 220, 200 210 Q220 200, 240 210"/>
                <path d="M30 230 Q50 220, 70 230 Q90 240, 110 230"/>
                <path d="M170 230 Q190 220, 210 230 Q230 240, 250 230"/>
                <path d="M50 260 Q70 250, 90 260 Q110 270, 130 260"/>
                <path d="M150 260 Q170 250, 190 260 Q210 270, 230 260"/>
              </g>

              {/* Точная копия демона с картинки */}
              <g>
                {/* Желтое пламя над головой - как на картинке */}
                <g fill="#ffd700" className="animate-pulse">
                  <path d="M140 15 Q138 8, 142 5 Q145 10, 148 5 Q150 12, 152 5 Q155 10, 158 5 Q162 8, 160 15 Q155 12, 150 18 Q145 12, 140 15"/>
                  <animate attributeName="fill" values="#ffd700;#ffed4e;#fbbf24;#ffd700" dur="1.5s" repeatCount="indefinite"/>
                </g>

                {/* Массивные изогнутые рога с полосками - точно как на картинке */}
                <g fill="#1a1a1a" stroke="#333" strokeWidth="1">
                  {/* Левый рог */}
                  <path d="M125 65 Q118 50, 115 35 Q112 20, 108 5 Q105 -5, 100 -10 Q95 -8, 98 -2 Q102 8, 105 18 Q108 28, 112 38 Q116 48, 120 60"/>
                  {/* Правый рог */}
                  <path d="M175 65 Q182 50, 185 35 Q188 20, 192 5 Q195 -5, 200 -10 Q205 -8, 202 -2 Q198 8, 195 18 Q192 28, 188 38 Q184 48, 180 60"/>
                </g>
                
                {/* Полоски на рогах */}
                <g stroke="#666" strokeWidth="2" fill="none">
                  <path d="M120 55 Q115 50, 112 45 M118 48 Q113 43, 110 38 M116 41 Q111 36, 108 31"/>
                  <path d="M180 55 Q185 50, 188 45 M182 48 Q187 43, 190 38 M184 41 Q189 36, 192 31"/>
                </g>

                {/* Козлиная голова с шерстью - текстурированная */}
                <g fill="#1a1a1a">
                  <ellipse cx="150" cy="70" rx="32" ry="28"/>
                  {/* Текстура шерсти */}
                  <g stroke="#333" strokeWidth="0.5" fill="none" opacity="0.6">
                    <path d="M120 65 Q125 60, 130 65 Q135 60, 140 65"/>
                    <path d="M160 65 Q165 60, 170 65 Q175 60, 180 65"/>
                    <path d="M125 75 Q130 70, 135 75 Q140 70, 145 75"/>
                    <path d="M155 75 Q160 70, 165 75 Q170 70, 175 75"/>
                  </g>
                </g>

                {/* Светящиеся желтые глаза - как на картинке */}
                <g>
                  <circle cx="140" cy="65" r="5" fill="#ffd700" className="animate-pulse"/>
                  <circle cx="160" cy="65" r="5" fill="#ffd700" className="animate-pulse"/>
                  <circle cx="140" cy="65" r="2" fill="#000"/>
                  <circle cx="160" cy="65" r="2" fill="#000"/>
                  <animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite"/>
                </g>

                {/* Морда козла */}
                <ellipse cx="150" cy="85" rx="18" ry="12" fill="#333"/>
                <ellipse cx="145" cy="85" rx="1.5" ry="1" fill="#000"/>
                <ellipse cx="155" cy="85" rx="1.5" ry="1" fill="#000"/>

                {/* Длинное черное пальто - точно как на картинке */}
                <g fill="#1a1a1a" stroke="#333" strokeWidth="1">
                  <path d="M105 110 C100 115, 95 300, 100 370 L125 370 L125 320 Q140 315, 150 320 Q160 315, 175 320 L175 370 L200 370 C205 300, 200 115, 195 110 Q150 100, 105 110"/>
                  
                  {/* Текстура пальто - штриховка */}
                  <g stroke="#444" strokeWidth="0.5" fill="none" opacity="0.3">
                    <path d="M110 130 L190 130 M112 140 L188 140 M110 150 L190 150"/>
                    <path d="M108 160 L192 160 M110 170 L190 170 M108 180 L192 180"/>
                    <path d="M105 250 L195 250 M107 260 L193 260 M105 270 L195 270"/>
                  </g>
                </g>

                {/* Серый жилет - как на картинке */}
                <g fill="#666" stroke="#555" strokeWidth="1">
                  <path d="M125 120 Q150 115, 175 120 L170 200 Q150 195, 130 200 Z"/>
                  {/* Пуговицы жилета */}
                  <circle cx="150" cy="135" r="2.5" fill="#999"/>
                  <circle cx="150" cy="150" r="2.5" fill="#999"/>
                  <circle cx="150" cy="165" r="2.5" fill="#999"/>
                  <circle cx="150" cy="180" r="2.5" fill="#999"/>
                </g>

                {/* Белая рубашка с воротником */}
                <g fill="#f8f8f8" stroke="#ddd" strokeWidth="1">
                  <path d="M135 120 Q150 117, 165 120 L162 170 Q150 167, 138 170 Z"/>
                  {/* Воротник */}
                  <path d="M140 120 L150 115 L160 120 L155 125 L145 125 Z"/>
                  {/* Полоски на рубашке */}
                  <g stroke="#eee" strokeWidth="0.5" fill="none" opacity="0.5">
                    <path d="M140 130 L160 130 M140 140 L160 140 M140 150 L160 150"/>
                  </g>
                </g>

                {/* Красный галстук - как на картинке */}
                <path d="M148 125 L152 125 L155 175 L150 180 L145 175 Z" fill="#dc2626"/>

                {/* Рукава пальто */}
                <g fill="#1a1a1a" stroke="#333" strokeWidth="1">
                  <ellipse cx="85" cy="170" rx="18" ry="50" transform="rotate(-5 85 170)"/>
                  <ellipse cx="215" cy="170" rx="18" ry="50" transform="rotate(5 215 170)"/>
                </g>

                {/* Белые манжеты */}
                <g fill="#f8f8f8" stroke="#ddd" strokeWidth="1">
                  <ellipse cx="80" cy="210" rx="15" ry="8" transform="rotate(-5 80 210)"/>
                  <ellipse cx="220" cy="210" rx="15" ry="8" transform="rotate(5 220 210)"/>
                </g>

                {/* Когтистые руки */}
                <g fill="#333">
                  <ellipse cx="75" cy="225" rx="10" ry="15" transform="rotate(-10 75 225)"/>
                  <ellipse cx="225" cy="225" rx="10" ry="15" transform="rotate(10 225 225)"/>
                </g>

                {/* Когти */}
                <g stroke="#555" strokeWidth="2" fill="none" strokeLinecap="round">
                  <path d="M70 235 L65 245 M73 237 L68 247 M76 240 L71 250"/>
                  <path d="M230 235 L235 245 M227 237 L232 247 M224 240 L229 250"/>
                </g>

                {/* Трость в левой руке - как на картинке */}
                <g>
                  <line x1="75" y1="225" x2="65" y2="340" stroke="#2d1d0a" strokeWidth="5" strokeLinecap="round"/>
                  <circle cx="72" cy="220" r="4" fill="#8b4513"/>
                </g>

                {/* Козлиные ноги с шерстью */}
                <g fill="#333">
                  <ellipse cx="135" cy="320" rx="15" ry="45"/>
                  <ellipse cx="165" cy="320" rx="15" ry="45"/>
                  {/* Текстура шерсти на ногах */}
                  <g stroke="#555" strokeWidth="0.5" fill="none" opacity="0.4">
                    <path d="M125 300 Q130 295, 135 300 Q140 295, 145 300"/>
                    <path d="M155 300 Q160 295, 165 300 Q170 295, 175 300"/>
                  </g>
                </g>

                {/* Копыта - как на картинке */}
                <g fill="#1a1a1a">
                  <ellipse cx="135" cy="365" rx="12" ry="8"/>
                  <ellipse cx="165" cy="365" rx="12" ry="8"/>
                  {/* Раздвоенные копыта */}
                  <path d="M135 360 L135 370 M165 360 L165 370" stroke="#000" strokeWidth="2"/>
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