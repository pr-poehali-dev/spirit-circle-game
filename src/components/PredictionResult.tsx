interface PredictionResultProps {
  finalAnswer: string;
  goldCoins: number;
}

const PredictionResult = ({ finalAnswer, goldCoins }: PredictionResultProps) => {
  if (!finalAnswer && goldCoins > 0) return null;

  return (
    <div className="inline-block ml-3">
      <div className={`${goldCoins === 0 ? 'bg-white text-red-600 border-2 border-red-500' : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'} px-4 py-2 rounded-lg shadow-lg`}>
        <div className={`text-xs ${goldCoins === 0 ? 'text-red-400' : 'text-gray-200'} mb-1`}>
          {goldCoins === 0 ? 'Статус:' : 'Ответ:'}
        </div>
        <div className="text-lg font-bold font-['Rubik']" style={{textShadow: goldCoins === 0 ? 'none' : '0 0 10px rgba(255,255,255,0.7)'}}>
          {goldCoins === 0 ? 'Лимит исчерпан' : finalAnswer}
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;