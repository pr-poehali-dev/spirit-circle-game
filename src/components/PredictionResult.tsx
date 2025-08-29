interface PredictionResultProps {
  finalAnswer: string;
}

const PredictionResult = ({ finalAnswer }: PredictionResultProps) => {
  if (!finalAnswer) return null;

  return (
    <div className="inline-block ml-3">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="text-xs text-gray-200 mb-1">Ответ:</div>
        <div className="text-lg font-bold font-['Rubik']" style={{textShadow: '0 0 10px rgba(255,255,255,0.7)'}}>
          {finalAnswer}
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;