import { useState } from 'react';
import Icon from '@/components/ui/icon';

const Instructions = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors w-full md:w-auto justify-center"
      >
        <Icon name="HelpCircle" size={20} />
        Как гадать?
        <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={20} />
      </button>
      
      {isOpen && (
        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="space-y-4 text-white">
            <h3 className="text-xl font-bold mb-4 text-center">🔮 Процесс гадания на колесе судьбы</h3>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-purple-400 font-bold">1.</span>
                <div>
                  <strong>Задайте вопрос:</strong> Сосредоточьтесь на волнующем вас вопросе. Лучше всего подходят вопросы, на которые можно ответить "Да" или "Нет".
                </div>
              </div>
              
              <div className="flex gap-3">
                <span className="text-purple-400 font-bold">2.</span>
                <div>
                  <strong>Сконцентрируйтесь:</strong> Закройте глаза, глубоко вдохните и мысленно сформулируйте свой вопрос четко и ясно.
                </div>
              </div>
              
              <div className="flex gap-3">
                <span className="text-purple-400 font-bold">3.</span>
                <div>
                  <strong>Запустите колесо:</strong> Нажмите на колесо несколько раз, чтобы запустить его вращение. Чем больше кликов - тем дольше оно будет крутиться.
                </div>
              </div>
              
              <div className="flex gap-3">
                <span className="text-purple-400 font-bold">4.</span>
                <div>
                  <strong>Поймайте черта:</strong> Когда появится бегающий чертик, попробуйте кликнуть на него - это принесет вам дополнительные монеты судьбы!
                </div>
              </div>
              
              <div className="flex gap-3">
                <span className="text-purple-400 font-bold">5.</span>
                <div>
                  <strong>Получите ответ:</strong> Когда колесо остановится, стрелка укажет на ваш ответ - "ДА" или "НЕТ", а также на буквы и цифры для дополнительных подсказок.
                </div>
              </div>
            </div>
            
            <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4 mt-6">
              <h4 className="font-bold text-red-300 mb-2">⚠️ Важные правила:</h4>
              <ul className="space-y-1 text-sm text-red-200">
                <li>• Подходите к гаданию с уважением и открытым сердцем</li>
                <li>• Не гадайте слишком часто на один и тот же вопрос</li>
                <li>• Помните: это развлечение, принимайте решения осознанно</li>
                <li>• Монеты можно тратить на дополнительные вращения</li>
              </ul>
            </div>
            
            <div className="text-center text-purple-300 text-sm mt-4">
              ✨ Пусть колесо судьбы укажет вам верный путь! ✨
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Instructions;