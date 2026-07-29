import { useState, useEffect, useCallback } from 'react';

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

const useScrambleText = (targetText: string, isActive: boolean, speed = 50) => {
  const [displayText, setDisplayText] = useState(targetText);
  useEffect(() => {
    if (!isActive) { setDisplayText(targetText); return; }
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(targetText.split('').map((char, i) => {
        if (char === ' ') return ' ';
        if (i < iteration) return targetText[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join(''));
      if (iteration >= targetText.length) clearInterval(interval);
      iteration += 1 / 3;
    }, speed);
    return () => clearInterval(interval);
  }, [targetText, isActive, speed]);
  return displayText;
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, duration = 1000 }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrambling, setIsScrambling] = useState(true);
  const titleText = useScrambleText('BLOG OF CACCIATORE', isScrambling, 15);
  const subtitleText = useScrambleText('INITIALIZING', isScrambling && progress > 20, 60);
  const completeLoading = useCallback(() => { setIsVisible(false); onComplete?.(); }, [onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => { if (prev >= 100) { clearInterval(interval); setTimeout(completeLoading, 300); return 100; } return prev + 2; });
    }, duration / 50);
    setTimeout(() => setIsScrambling(false), 800);
    return () => { clearInterval(interval); };
  }, [duration, completeLoading]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[100] bg-white dark:bg-black flex flex-col items-center justify-center transition-opacity duration-500 ${progress >= 100 ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-black dark:text-white font-mono mb-4">{titleText}</h1>
        <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-gray-400 mb-8">{subtitleText}</p>
        <div className="w-64 md:w-80 mx-auto">
          <div className="h-[1px] w-full bg-gray-200 dark:bg-gray-700 mb-2">
            <div className="h-full bg-black dark:bg-white transition-all duration-100 ease-out" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-gray-400">
            <span>{progress.toString().padStart(3, '0')}%</span>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }} />
    </div>
  );
};