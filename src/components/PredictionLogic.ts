// Логика предсказаний для гадания
export interface PredictionResult {
  type: 'yesno' | 'number' | 'letter';
  value: string;
  angle: number;
}

export const alphabet = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');

export const analyzeText = (text: string): PredictionResult => {
  const lowerText = text.toLowerCase();
  
  // Подсчет различных характеристик текста
  const vowels = (text.match(/[аеиоуыэюя]/gi) || []).length;
  const consonants = (text.match(/[бвгджзйклмнпрстфхцчшщ]/gi) || []).length;
  const textLength = text.length;
  const wordsCount = text.trim().split(/\s+/).length;
  
  // Определение типа вопроса и генерация результата
  const isYesNoQuestion = /\b(ли|да|нет|будет|стоит|можно|нужно)\b/.test(lowerText) || 
                        text.includes('?');
  
  const isNumberQuestion = /\b(сколько|когда|во сколько|через|лет|дней|месяцев)\b/.test(lowerText);
  
  const isLetterQuestion = /\b(буква|имя|название|как зовут|начинается)\b/.test(lowerText);
  
  // Базовый расчет на основе характеристик текста
  const baseValue = (vowels * 7 + consonants * 3 + textLength * 2 + wordsCount * 5) % 100;
  
  if (isYesNoQuestion) {
    return analyzeYesNoQuestion(text, lowerText, baseValue, vowels, consonants, textLength, wordsCount);
  } else if (isNumberQuestion) {
    const number = (baseValue % 12) + 1;
    return {
      type: 'number',
      value: number.toString(),
      angle: (number - 1) * 30 // Позиция числа на циферблате
    };
  } else if (isLetterQuestion) {
    const letterIndex = baseValue % alphabet.length;
    return {
      type: 'letter',
      value: alphabet[letterIndex],
      angle: (letterIndex / alphabet.length) * 360 // Позиция буквы
    };
  } else {
    return analyzeDefaultQuestion(text, lowerText, baseValue, vowels, consonants, textLength, wordsCount);
  }
};

const analyzeYesNoQuestion = (
  text: string,
  lowerText: string,
  baseValue: number,
  vowels: number,
  consonants: number,
  textLength: number,
  wordsCount: number
): PredictionResult => {
  // Сложный алгоритм для максимально неодинаковых ответов
  
  // 1. Анализ содержания вопроса
  const positiveWords = /\b(хорошо|удача|счастье|любовь|радость|успех|можно|стоит|получится|везет|выйду|замуж|женюсь|поможет|сбудется)\b/i.test(lowerText);
  const negativeWords = /\b(плохо|беда|проблема|болезнь|грусть|неудача|нельзя|опасно|провал|боль|умру|разведусь|потеряю|обманут)\b/i.test(lowerText);
  const uncertainWords = /\b(может|возможно|наверное|кажется|думаю|сомневаюсь|не знаю)\b/i.test(lowerText);
  
  // 2. Анализ типа вопроса
  const aboutLove = /\b(любовь|любит|отношения|свадьба|замуж|парень|девушка|муж|жена)\b/i.test(lowerText);
  const aboutMoney = /\b(деньги|работа|зарплата|богатство|купить|продать|бизнес)\b/i.test(lowerText);
  const aboutHealth = /\b(здоровье|болезнь|лечение|врач|больница|лекарство)\b/i.test(lowerText);
  const aboutFuture = /\b(будет|станет|произойдет|случится|через|скоро|завтра|год)\b/i.test(lowerText);
  
  // 3. Уникальный хеш вопроса для стабильности ответа на одинаковые вопросы
  let questionHash = 0;
  for (let i = 0; i < text.length; i++) {
    questionHash = ((questionHash << 5) - questionHash + text.charCodeAt(i)) & 0x7fffffff;
  }
  const stableRandom = (questionHash % 100);
  
  // 4. Базовая вероятность зависит от типа вопроса
  let yesThreshold = 50;
  
  // Тематические корректировки
  if (aboutLove) yesThreshold = 65; // Любовь чаще положительна
  if (aboutMoney) yesThreshold = 45; // Деньги сложнее получить
  if (aboutHealth) yesThreshold = uncertainWords ? 40 : 60; // Здоровье зависит от уверенности
  if (aboutFuture) yesThreshold = 55; // Будущее слегка оптимистично
  
  // Тональные корректировки
  if (positiveWords && !negativeWords) yesThreshold += 20;
  if (negativeWords && !positiveWords) yesThreshold -= 25;
  if (uncertainWords) yesThreshold -= 10;
  
  // Структурные корректировки
  if (textLength > 60) yesThreshold -= 15; // Длинные вопросы = больше сомнений
  if (textLength < 15) yesThreshold += 10; // Короткие = быстрые решения
  if (wordsCount === 1) yesThreshold += 15; // Одно слово = прямой ответ
  
  // Временные корректировки
  const hour = new Date().getHours();
  const day = new Date().getDay();
  if (hour >= 6 && hour <= 10) yesThreshold += 8; // Утренний оптимизм
  if (hour >= 22 || hour <= 5) yesThreshold -= 12; // Ночные сомнения
  if (day === 1) yesThreshold -= 5; // Понедельник более пессимистичен
  if (day === 5 || day === 6) yesThreshold += 5; // Пятница/суббота более позитивны
  
  // Числовые характеристики текста
  if (vowels > consonants) yesThreshold += 5; // Больше гласных = мелодичнее = позитивнее
  if (text.includes('?')) yesThreshold -= 3; // Вопросительный знак = больше сомнений
  if (text.includes('!')) yesThreshold += 8; // Восклицательный = больше энергии
  
  // Финальное решение на основе стабильного хеша
  const isYes = stableRandom < Math.max(10, Math.min(90, yesThreshold));
  
  return {
    type: 'yesno',
    value: isYes ? 'ДА' : 'НЕТ',
    angle: isYes ? 90 : 270 // ДА направо (90°), НЕТ налево (270°)
  };
};

const analyzeDefaultQuestion = (
  text: string,
  lowerText: string,
  baseValue: number,
  vowels: number,
  consonants: number,
  textLength: number,
  wordsCount: number
): PredictionResult => {
  // По умолчанию - тот же сложный алгоритм
  const positiveWords = /\b(хорошо|удача|счастье|любовь|радость|успех|можно|стоит|получится|везет|выйду|замуж|женюсь|поможет|сбудется)\b/i.test(lowerText);
  const negativeWords = /\b(плохо|беда|проблема|болезнь|грусть|неудача|нельзя|опасно|провал|боль|умру|разведусь|потеряю|обманут)\b/i.test(lowerText);
  const uncertainWords = /\b(может|возможно|наверное|кажется|думаю|сомневаюсь|не знаю)\b/i.test(lowerText);
  
  const aboutLove = /\b(любовь|любит|отношения|свадьба|замуж|парень|девушка|муж|жена)\b/i.test(lowerText);
  const aboutMoney = /\b(деньги|работа|зарплата|богатство|купить|продать|бизнес)\b/i.test(lowerText);
  const aboutHealth = /\b(здоровье|болезнь|лечение|врач|больница|лекарство)\b/i.test(lowerText);
  const aboutFuture = /\b(будет|станет|произойдет|случится|через|скоро|завтра|год)\b/i.test(lowerText);
  
  let questionHash = 0;
  for (let i = 0; i < text.length; i++) {
    questionHash = ((questionHash << 5) - questionHash + text.charCodeAt(i)) & 0x7fffffff;
  }
  const stableRandom = (questionHash % 100);
  
  let yesThreshold = 50;
  
  if (aboutLove) yesThreshold = 65;
  if (aboutMoney) yesThreshold = 45;
  if (aboutHealth) yesThreshold = uncertainWords ? 40 : 60;
  if (aboutFuture) yesThreshold = 55;
  
  if (positiveWords && !negativeWords) yesThreshold += 20;
  if (negativeWords && !positiveWords) yesThreshold -= 25;
  if (uncertainWords) yesThreshold -= 10;
  
  if (textLength > 60) yesThreshold -= 15;
  if (textLength < 15) yesThreshold += 10;
  if (wordsCount === 1) yesThreshold += 15;
  
  const hour = new Date().getHours();
  const day = new Date().getDay();
  if (hour >= 6 && hour <= 10) yesThreshold += 8;
  if (hour >= 22 || hour <= 5) yesThreshold -= 12;
  if (day === 1) yesThreshold -= 5;
  if (day === 5 || day === 6) yesThreshold += 5;
  
  if (vowels > consonants) yesThreshold += 5;
  if (text.includes('?')) yesThreshold -= 3;
  if (text.includes('!')) yesThreshold += 8;
  
  const isYes = stableRandom < Math.max(10, Math.min(90, yesThreshold));
  
  return {
    type: 'yesno',
    value: isYes ? 'ДА' : 'НЕТ',
    angle: isYes ? 90 : 270
  };
};