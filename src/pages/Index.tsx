import { useState } from 'react';
import { useGameLogic } from '@/hooks/useGameLogic';
import QuestionInput from '@/components/QuestionInput';
import FortuneWheel from '@/components/FortuneWheel';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-start p-4 overflow-hidden" style={{paddingTop: '30px'}}>
      {/* Кнопка инструкций в левом верхнем углу */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => setShowInstructions(true)}
          className="text-white px-3 py-1 sm:px-4 sm:py-2 font-bold text-sm sm:text-lg shadow-lg border-2 border-gray-400 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          title="Инструкция"
        >
          <Icon name="HelpCircle" size={20} />
        </button>
      </div>

      {/* Счетчик монет и кнопка благодарности в правом верхнем углу */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowDonation(true)}
          className="text-white px-3 py-1 sm:px-4 sm:py-2 font-bold text-sm sm:text-lg shadow-lg border-2 border-gray-400 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          title="Отблагодарить демона"
        >
          💰 {goldCoins}
        </button>
      </div>
      
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Главный заголовок */}
        <div className="text-center mb-4 sm:mb-8 mt-2 sm:mt-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 font-['Rubik'] px-4" style={{textShadow: '0 0 20px rgba(255,255,255,0.3)'}}>
            Гадание на Демона
          </h1>
        </div>



        {/* Окно ввода текста */}
        <div className="w-full mb-4 sm:mb-6">
          <QuestionInput 
            onPrediction={handlePrediction}
            isAnalyzing={isAnalyzing}
            finalAnswer={finalAnswer}
            goldCoins={goldCoins}
            onInsufficientCoins={() => setShowDonation(true)}
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

      {/* Модальное окно с инструкцией */}
      {showInstructions && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/20 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white font-['Rubik']">Как гадать на Демоне</h2>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <Icon name="X" size={24} />
                </button>
              </div>
              
              <div className="text-white font-['Rubik']">
                <p className="text-base mb-4 text-gray-300">
                  Гадание на Демоне — это популярная форма шаманского гадания, которая включает в себя использование круга с символами и буквами.
                </p>
                
                <div className="mb-4">
                  <h3 className="text-lg font-bold mb-2 text-white">Процесс гадания:</h3>
                  <ul className="text-base text-gray-300 space-y-2 pl-4">
                    <li>• <strong>Установите намерение:</strong> Сосредоточьтесь на вопросе, на который хотите получить ответ. Желательно, чтобы вопрос был закрытым (ответы "Да" или "Нет").</li>
                    <li>• В строке ввода текста задайте вопрос и нажмите «ОК»</li>
                    <li>• Указатель размещается в центре круга</li>
                    <li>• Ожидание ответа: Указатель начнет двигаться сам по кругу в ответ на вопрос, останавливаясь на буквах, цифрах или отметках "Да"/"Нет". Демон берет оплату 25 монет за каждый ответ!</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-bold mb-2 text-white">Заключение:</h3>
                  <p className="text-base text-gray-300">
                    После завершения гадания поблагодарите Демона (награда ему монеты 💰)
                  </p>
                </div>

                <div className="border-t border-white/20 pt-4">
                  <h3 className="text-lg font-bold mb-2 text-orange-400">Важно:</h3>
                  <ul className="text-base text-gray-300 space-y-1 pl-4">
                    <li>• Подходите к этому гаданию с открытым и уважительным умом.</li>
                    <li>• Не используйте его слишком часто, чтобы не стать зависимым от советов извне.</li>
                    <li>• Убедитесь, что все участники согласны на участие в подобном процессе.</li>
                  </ul>
                  <p className="text-center mt-4 text-lg font-bold text-green-400">Удачи в гадании! 🔮</p>
                  
                  <div className="mt-6 pt-4 border-t border-white/20 text-center">
                    <p className="text-gray-300 text-sm mb-3 font-['Rubik']">
                      Возникли вопросы или проблемы? Пишите!
                    </p>
                    <a 
                      href="https://t.me/Unix77777" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors font-['Rubik']"
                    >
                      <Icon name="Send" size={20} />
                      Связаться в Telegram
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно благодарности демону */}
      {showDonation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-red-500 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white font-['Rubik']">        😈 Пополнить монеты</h2>
                <button
                  onClick={() => setShowDonation(false)}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <Icon name="X" size={24} />
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-2xl text-gray-300 mb-1 font-['Rubik']">
                  100₽ = 4 гадания
                </p>
                <p className="text-sm text-gray-400 mb-6 font-['Rubik']">
                  Каждое гадание — 25 монет
                </p>
                
                {/* QR код */}
                <div className="flex justify-center mb-4">
                  <img 
                    src="https://cdn.poehali.dev/files/a68c64b1-50e5-4155-8ab1-779dc4315afc.jpg"
                    alt="QR код для пожертвований"
                    className="w-48 h-48 object-contain border-2 border-white/20 rounded-lg"
                  />
                </div>
                
                <div className="text-center mb-4">
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-lg mb-3 inline-flex items-center gap-2 font-['Rubik']">
                    <span className="text-lg">⚡</span>
                    <span className="font-bold">Т-Банк</span>
                  </div>
                  
                  <div className="text-sm text-gray-400 font-['Rubik'] space-y-1">
                    <p>1. Отсканируйте QR-код</p>
                    <p>2. ИП Паклин СВ</p>
                    <p>3. введите сумму</p>
                  </div>
                </div>
                
                <div className="bg-gray-800/30 border border-gray-500 rounded-lg p-3">
                  <p className="text-gray-300 text-base font-['Rubik']">
                    Сумма перевода не отображается в монетах после оплаты. Просто обновите сайт - появится снова 100 монет.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;