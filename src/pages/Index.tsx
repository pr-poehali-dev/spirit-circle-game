import { useGameLogic } from '@/hooks/useGameLogic';
import QuestionInput from '@/components/QuestionInput';
import FortuneWheel from '@/components/FortuneWheel';

const Index = () => {
  const {
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
    handleCircleClick,
    handlePrediction
  } = useGameLogic();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Огонь в левом нижнем углу */}
      <div className="fixed bottom-0 left-0 w-32 h-48 pointer-events-none z-10">
        <div className="relative w-full h-full">
          <div 
            className="absolute bottom-0 w-full h-full rounded-t-full opacity-80"
            style={{
              background: 'linear-gradient(0deg, #ff4500 0%, #ff6b35 20%, #ff8c42 40%, #ffaa44 60%, #ffc947 80%, #fff 100%)',
              animation: 'fire-flicker 2s ease-in-out infinite alternate, fire-dance 3s ease-in-out infinite'
            }}
          />
          <div 
            className="absolute bottom-0 left-1/4 w-1/2 h-4/5 rounded-t-full opacity-70"
            style={{
              background: 'linear-gradient(0deg, #ff6b00 0%, #ff8c42 30%, #ffaa44 60%, #ffc947 90%, #fff 100%)',
              animation: 'fire-flicker 1.8s ease-in-out infinite alternate-reverse, fire-dance 2.5s ease-in-out infinite reverse'
            }}
          />
          <div 
            className="absolute bottom-0 left-1/3 w-1/3 h-3/5 rounded-t-full opacity-60"
            style={{
              background: 'linear-gradient(0deg, #ff8c00 0%, #ffaa44 40%, #ffc947 80%, #fff 100%)',
              animation: 'fire-flicker 1.5s ease-in-out infinite, fire-dance 2.2s ease-in-out infinite'
            }}
          />
        </div>
      </div>

      {/* Огонь в правом нижнем углу */}
      <div className="fixed bottom-0 right-0 w-32 h-48 pointer-events-none z-10">
        <div className="relative w-full h-full">
          <div 
            className="absolute bottom-0 w-full h-full rounded-t-full opacity-80"
            style={{
              background: 'linear-gradient(0deg, #ff4500 0%, #ff6b35 20%, #ff8c42 40%, #ffaa44 60%, #ffc947 80%, #fff 100%)',
              animation: 'fire-flicker 2.2s ease-in-out infinite alternate-reverse, fire-dance 2.8s ease-in-out infinite reverse'
            }}
          />
          <div 
            className="absolute bottom-0 left-1/4 w-1/2 h-4/5 rounded-t-full opacity-70"
            style={{
              background: 'linear-gradient(0deg, #ff6b00 0%, #ff8c42 30%, #ffaa44 60%, #ffc947 90%, #fff 100%)',
              animation: 'fire-flicker 1.9s ease-in-out infinite, fire-dance 3.2s ease-in-out infinite'
            }}
          />
          <div 
            className="absolute bottom-0 left-1/3 w-1/3 h-3/5 rounded-t-full opacity-60"
            style={{
              background: 'linear-gradient(0deg, #ff8c00 0%, #ffaa44 40%, #ffc947 80%, #fff 100%)',
              animation: 'fire-flicker 1.6s ease-in-out infinite alternate, fire-dance 2.6s ease-in-out infinite reverse'
            }}
          />
        </div>
      </div>

      <div className="relative overflow-hidden">
        {/* Главный заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 font-['Rubik']" style={{textShadow: '0 0 20px rgba(255,255,255,0.3)'}}>
            Гадание на Черта
          </h1>
          <p className="text-gray-400 text-lg">
            Кликните 3 раза в круг и поймайте черта
          </p>
        </div>

        {/* Окно ввода текста */}
        <QuestionInput 
          onPrediction={handlePrediction}
          isAnalyzing={isAnalyzing}
          finalAnswer={finalAnswer}
        />

        {/* Колесо фортуны */}
        <FortuneWheel
          clickCount={clickCount}
          showDevil={showDevil}
          devilCaught={devilCaught}
          devilPosition={devilPosition}
          isDevilMoving={isDevilMoving}
          arrowSpeed={arrowSpeed}
          shouldStop={shouldStop}
          finalAngle={finalAngle}
          onCircleClick={handleCircleClick}
        />
      </div>
    </div>
  );
};

export default Index;