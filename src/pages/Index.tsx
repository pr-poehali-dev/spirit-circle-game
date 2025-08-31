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
    <div className="min-h-screen bg-black flex flex-col items-center justify-start p-4 overflow-hidden">
      {/* Счетчик монет в правом верхнем углу */}
      <div className="fixed top-4 right-4 z-50 text-white px-3 py-1 sm:px-4 sm:py-2 font-bold text-sm sm:text-lg shadow-lg border-2 border-gray-400 rounded-lg bg-gray-800">
        💰 {goldCoins}
      </div>
      
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Главный заголовок */}
        <div className="text-center mb-4 sm:mb-8 mt-2 sm:mt-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 font-['Rubik'] px-4" style={{textShadow: '0 0 20px rgba(255,255,255,0.3)'}}>
            Гадание на Демона
          </h1>
        </div>

        {/* Инструкция */}
        <div className="w-full mb-6 px-4 max-w-3xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
            <div className="text-white font-['Rubik']">
              <p className="text-sm sm:text-base mb-4 text-gray-300">
                Гадание на Демоне — это популярная форма шаманского гадания, которая включает в себя использование круга с символами и буквами.
              </p>
              
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-2 text-white">Процесс гадания:</h3>
                <ul className="text-sm sm:text-base text-gray-300 space-y-2 pl-4">
                  <li>• <strong>Установите намерение:</strong> Сосредоточьтесь на вопросе, на который хотите получить ответ. Желательно, чтобы вопрос был закрытым (ответы "Да" или "Нет").</li>
                  <li>• В строке ввода текста задайте вопрос и нажмите «ок»</li>
                  <li>• Указатель размещается в центре круга</li>
                  <li>• <strong>Ожидание ответа:</strong> Указатель начнет двигаться сам по кругу в ответ на вопрос, останавливаясь на буквах, цифрах или отметках "Да"/"Нет".</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-bold mb-2 text-white">Заключение:</h3>
                <p className="text-sm sm:text-base text-gray-300">
                  После завершения гадания поблагодарите Демона (награда ему монеты 💰)
                </p>
              </div>

              <div className="border-t border-white/20 pt-4">
                <h3 className="text-lg font-bold mb-2 text-orange-400">Важно:</h3>
                <ul className="text-sm sm:text-base text-gray-300 space-y-1 pl-4">
                  <li>• Подходите к этому гаданию с открытым и уважительным умом.</li>
                  <li>• Не используйте его слишком часто, чтобы не стать зависимым от советов извне.</li>
                  <li>• Убедитесь, что все участники согласны на участие в подобном процессе.</li>
                </ul>
                <p className="text-center mt-4 text-lg font-bold text-green-400">Удачи в гадании! 🔮</p>
              </div>
            </div>
          </div>
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