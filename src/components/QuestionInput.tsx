import { useState } from 'react';
import PredictionResult from './PredictionResult';

interface QuestionInputProps {
  onPrediction: (text: string) => void;
  isAnalyzing: boolean;
  finalAnswer: string;
  goldCoins: number;
}

const QuestionInput = ({ onPrediction, isAnalyzing, finalAnswer, goldCoins }: QuestionInputProps) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = () => {
    if (inputText.trim() && goldCoins > 0) {
      onPrediction(inputText);
    }
  };

  return (
    <div className="mb-4 w-full max-w-2xl mx-auto px-4">
      {/* Мобильная версия - вертикальная */}
      <div className="flex flex-col sm:hidden gap-3 items-center">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={goldCoins > 0 ? "Задайте свой вопрос..." : "Лимит исчерпан"}
          className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white ${goldCoins === 0 ? 'placeholder-red-400' : 'placeholder-gray-400'} focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300 font-['Rubik'] text-center`}
          style={{
            backdropFilter: 'blur(10px)',
            textShadow: '0 0 10px rgba(255,255,255,0.3)'
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={isAnalyzing || goldCoins === 0}
        />
        <button
          onClick={handleSubmit}
          disabled={!inputText.trim() || isAnalyzing || goldCoins === 0}
          className="w-24 px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white font-bold hover:bg-white/30 hover:border-white/50 transition-all duration-300 font-['Rubik'] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          style={{
            backdropFilter: 'blur(10px)',
            textShadow: '0 0 10px rgba(255,255,255,0.5)'
          }}
        >
          {isAnalyzing ? 'Гадаю...' : 'ОК'}
        </button>
        <PredictionResult finalAnswer={finalAnswer} />
      </div>

      {/* Десктопная версия - горизонтальная */}
      <div className="hidden sm:flex justify-center items-center gap-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={goldCoins > 0 ? "Задайте свой вопрос..." : "Лимит исчерпан"}
          className={`w-80 lg:w-96 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white ${goldCoins === 0 ? 'placeholder-red-400' : 'placeholder-gray-400'} focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300 font-['Rubik']`}
          style={{
            backdropFilter: 'blur(10px)',
            textShadow: '0 0 10px rgba(255,255,255,0.3)'
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={isAnalyzing || goldCoins === 0}
        />
        <button
          onClick={handleSubmit}
          disabled={!inputText.trim() || isAnalyzing || goldCoins === 0}
          className="px-6 py-3 bg-white/20 border border-white/30 rounded-lg text-white font-bold hover:bg-white/30 hover:border-white/50 transition-all duration-300 font-['Rubik'] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backdropFilter: 'blur(10px)',
            textShadow: '0 0 10px rgba(255,255,255,0.5)'
          }}
        >
          {isAnalyzing ? 'Гадаю...' : 'ОК'}
        </button>
        <PredictionResult finalAnswer={finalAnswer} />
      </div>
    </div>
  );
};

export default QuestionInput;