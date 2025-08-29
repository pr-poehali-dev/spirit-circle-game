interface PredictionResultProps {
  finalAnswer: string;
}

const PredictionResult = ({ finalAnswer }: PredictionResultProps) => {
  if (!finalAnswer) return null;

  return (
    <div className="text-center mt-6">
      <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg shadow-lg">
        <div className="text-sm text-gray-200 mb-1">Ответ:</div>
        <div className="text-3xl font-bold font-['Rubik']" style={{textShadow: '0 0 15px rgba(255,255,255,0.7)'}}>
          {finalAnswer}
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;