import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const StatusIndicator = () => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [loadTime, setLoadTime] = useState<number>(0);

  useEffect(() => {
    const startTime = Date.now();
    
    // Проверяем базовую работоспособность
    const checkStatus = () => {
      try {
        // Проверяем что все основные элементы загружены
        const hasRoot = document.getElementById('root');
        const hasStyles = document.querySelector('style, link[rel="stylesheet"]');
        const currentTime = Date.now();
        
        if (hasRoot && hasStyles) {
          setStatus('online');
          setLoadTime(currentTime - startTime);
        } else {
          setStatus('offline');
        }
      } catch (error) {
        setStatus('offline');
      }
    };

    // Проверяем статус через 100мс
    const timer = setTimeout(checkStatus, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'online': return 'CheckCircle';
      case 'offline': return 'XCircle';
      default: return 'Clock';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online': return `Работает (${loadTime}мс)`;
      case 'offline': return 'Ошибка загрузки';
      default: return 'Проверка...';
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-gray-900/90 border border-gray-600 rounded-lg px-3 py-2 flex items-center gap-2">
        <Icon 
          name={getStatusIcon()} 
          size={16} 
          className={getStatusColor()}
        />
        <span className={`text-xs font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
    </div>
  );
};

export default StatusIndicator;