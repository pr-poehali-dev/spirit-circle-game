import { useRef, useEffect } from 'react';
import { alphabet } from './PredictionLogic';

interface FortuneWheelProps {
  clickCount: number;
  showDevil: boolean;
  devilCaught: boolean;
  devilPosition: { x: number; y: number };
  isDevilMoving: boolean;
  arrowSpeed: number;
  shouldStop: boolean;
  finalAngle: number;
  onCircleClick: (e: React.MouseEvent) => void;
}

const FortuneWheel = ({
  clickCount,
  showDevil,
  devilCaught,
  devilPosition,
  isDevilMoving,
  arrowSpeed,
  shouldStop,
  finalAngle,
  onCircleClick
}: FortuneWheelProps) => {
  const circleRef = useRef<HTMLDivElement>(null);
  const hourNumbers = Array.from({length: 12}, (_, i) => (i + 1).toString());

  return (
    <div className="flex items-center justify-center gap-8">
      <div className="text-white text-2xl font-bold font-['Rubik'] select-none" style={{textShadow: '0 0 20px rgba(255,255,255,0.5)'}}>
        НЕТ
      </div>
      
      {/* Основной круг */}
      <div 
        ref={circleRef}
        className="relative w-[648px] h-[648px] bg-white rounded-full cursor-pointer select-none shadow-[0_0_50px_rgba(255,255,255,0.3)] border-2 border-black" 
        onClick={onCircleClick}
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
              filter: 'brightness(0.8) contrast(1.5) saturate(0.3) hue-rotate(180deg)',
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
  );
};

export default FortuneWheel;