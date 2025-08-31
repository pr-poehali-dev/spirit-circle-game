import { useGameLogic } from '@/hooks/useGameLogic';
import QuestionInput from '@/components/QuestionInput';
import FortuneWheel from '@/components/FortuneWheel';
import Instructions from '@/components/Instructions';

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
    <div className="min-h-screen bg-black flex flex-col items-center justify-start p-4 overflow-hidden">
      {/* Счетчик монет в правом верхнем углу */}
      <div className="fixed top-4 right-4 z-50 text-white px-3 py-1 sm:px-4 sm:py-2 font-bold text-sm sm:text-lg shadow-lg border-2 border-gray-400 rounded-lg bg-gray-800">
        💰 {goldCoins}
      </div>
      
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Главный заголовок */}
        <div className="text-center mb-4 sm:mb-8 mt-2 sm:mt-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 font-['Rubik'] px-4" style={{textShadow: '0 0 20px rgba(255,255,255,0.3)'}}>Гадание на Демоне</h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg px-4"></p>
        </div>

        {/* Инструкция */}
        <div className="w-full mb-4 sm:mb-6">
          <Instructions />
        </div>

        {/* Окно ввода текста */}
        <div className="w-full mb-4 sm:mb-6">
          <QuestionInput 
            onPrediction={handlePrediction}
            isAnalyzing={isAnalyzing}
            finalAnswer={finalAnswer}
          />
        </div>

        {/* Колесо фортуны */}
        <div className="flex-1 flex items-center justify-center w-full">
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
    </div>
  );
};

export default Index;