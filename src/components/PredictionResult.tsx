interface PredictionResultProps {
  finalAnswer: string;
  goldCoins: number;
}

const PredictionResult = ({ finalAnswer, goldCoins }: PredictionResultProps) => {
  if (!finalAnswer && goldCoins > 0) return null;

  return (
    <div className="inline-block ml-3">
      <div className={`${goldCoins === 0 ? 'bg-white text-red-600 border-2 border-red-500 flex items-center px-4 py-2 sm:px-6 sm:py-3' : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1'} rounded-lg shadow-lg`}>
        {goldCoins !== 0 && (
          <div className="text-xs text-gray-200 mb-1">
            Ответ:
          </div>
        )}
        <div className={`font-bold font-['Rubik'] ${goldCoins === 0 ? 'text-base sm:text-lg' : 'text-xs'}`} style={{textShadow: goldCoins === 0 ? 'none' : '0 0 10px rgba(255,255,255,0.7)'}}>
          {goldCoins === 0 ? 'Лимит исчерпан' : finalAnswer}
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;