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
    goldCoins,
    handleCircleClick,
    handlePrediction
  } = useGameLogic();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden">
      {/* Счетчик монет в правом верхнем углу */}
      <div className="fixed top-4 right-4 bg-yellow-600 text-black px-4 py-2 rounded-lg font-bold text-lg shadow-lg border-2 border-yellow-400" style={{textShadow: '0 0 10px rgba(255,215,0,0.5)'}}>
        💰 {goldCoins}
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