/**
 * Loading Screen Component
 * Glitch text effect inspired by aino.agency
 * Features: character scrambling, progress bar, monospace typography
 */
import { useState, useEffect, useCallback } from 'react';

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

/**
 * Scramble text effect
 */
const useScrambleText = (targetText: string, isActive: boolean, speed: number = 50) => {
  const [displayText, setDisplayText] = useState(targetText);

  useEffect(() => {
    if (!isActive) {
      setDisplayText(targetText);
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        targetText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return targetText[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      if (iteration >= targetText.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, speed);

    return () => clearInterval(interval);
  }, [targetText, isActive, speed]);

  return displayText;
};

/**
 * LoadingScreen - Glitch loading animation
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  duration = 2000,
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrambling, setIsScrambling] = useState(true);

  const titleText = useScrambleText('ARORMS.BLOG', isScrambling, 40);
  const subtitleText = useScrambleText('SYSTEM.INITIALIZING', isScrambling && progress > 30, 60);

  const completeLoading = useCallback(() => {
    setIsVisible(false);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(completeLoading, 300);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    // Stop scrambling after initial animation
    const scrambleTimeout = setTimeout(() => {
      setIsScrambling(false);
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(scrambleTimeout);
    };
  }, [duration, completeLoading]);

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[100] bg-white
        flex flex-col items-center justify-center
        transition-opacity duration-500
        ${progress >= 100 ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* Main content */}
      <div className="text-center">
        {/* Title with glitch effect */}
        <h1
          className="
            text-4xl md:text-6xl font-bold tracking-tighter text-black
            font-mono mb-4
          "
          style={{ fontFamily: 'monospace' }}
        >
          {titleText}
        </h1>

        {/* Subtitle */}
        <p
          className="
            text-[10px] md:text-xs font-mono uppercase tracking-[0.3em]
            text-gray-400 mb-8
          "
        >
          {subtitleText}
        </p>

        {/* Progress bar container */}
        <div className="w-64 md:w-80 mx-auto">
          {/* Progress bar background */}
          <div className="h-[1px] w-full bg-gray-200 mb-2">
            {/* Progress bar fill */}
            <div
              className="h-full bg-black transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Progress text */}
          <div className="flex justify-between text-[10px] font-mono text-gray-400">
            <span>LOADING</span>
            <span>{progress.toString().padStart(3, '0')}%</span>
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 text-[10px] font-mono text-gray-300">
        <div>VER.1.0.0</div>
        <div>BUILD.2024</div>
      </div>

      <div className="absolute top-8 right-8 text-[10px] font-mono text-gray-300 text-right">
        <div>REACT.TS</div>
        <div>SPRING.BOOT</div>
      </div>

      <div className="absolute bottom-8 left-8 text-[10px] font-mono text-gray-300">
        <div>COORD: 00.00</div>
        <div>STATUS: ACTIVE</div>
      </div>

      <div className="absolute bottom-8 right-8 text-[10px] font-mono text-gray-300 text-right">
        <div>MEM: 64TB</div>
        <div>CPU: 99.9%</div>
      </div>

      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            #000 2px,
            #000 4px
          )`,
        }}
      />
    </div>
  );
};
