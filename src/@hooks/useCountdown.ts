import { useState } from 'react';

export function useCountdown() {
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const startCountdown = (onComplete: () => void) => {
    setIsCountingDown(true);
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          setIsCountingDown(false);
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return {
    isCountingDown,
    countdown,
    startCountdown,
  };
}
