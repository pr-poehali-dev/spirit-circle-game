interface PredictionResultProps {
  finalAnswer: string;
  goldCoins: number;
  showInsufficientMessage?: boolean;
}

const PredictionResult = ({ finalAnswer, goldCoins, showInsufficientMessage = false }: PredictionResultProps) => {
  if (!finalAnswer && (goldCoins > 0 || !showInsufficientMessage)) return null;

  return (
    <div className="inline-block ml-3">
      <div className={`${goldCoins === 0 ? 'bg-white text-red-600 border-2 border-red-500 flex items-center justify-center px-2 py-2 sm:px-3 sm:py-3' : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1'} rounded-lg shadow-lg`}>
        {goldCoins !== 0 && (
          <div className="text-xs text-gray-200 mb-1">
            Ответ:
          </div>
        )}
        <div className={`font-bold font-['Rubik'] whitespace-nowrap ${goldCoins === 0 ? 'text-sm sm:text-base' : 'text-xs'}`} style={{textShadow: goldCoins === 0 ? 'none' : '0 0 10px rgba(255,255,255,0.7)'}}>
          {goldCoins === 0 ? 'Пополни монеты' : finalAnswer}
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;