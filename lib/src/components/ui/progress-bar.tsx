import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  fromTime: number; // timestamp in ms
  toTime: number;   // timestamp in ms
  isCompleted: boolean;
  backgroundColor?: string;
  fillColor?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  fromTime,
  toTime,
  isCompleted,
}) => {
  const [progress, setProgress] = useState(0);
  const [timeLeftStr, setTimeLeftStr] = useState('00:00');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const totalDuration = toTime - fromTime;
      const elapsed = Math.min(now - fromTime, totalDuration);
      let newProgress = Math.min((elapsed / totalDuration) * 90, 90);
      if (isCompleted) newProgress = 100;
      setProgress(newProgress);

      const timeLeft = toTime - now;
      if (timeLeft <= 0) {
        setTimeLeftStr('Soon');
      } else {
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        setTimeLeftStr(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} min`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [fromTime, toTime, isCompleted]);

  return (
    <div className={`easyleap-relative easyleap-rounded-xl easyleap-w-full easyleap-h-[20px] easyleap-overflow-hidden easyleap-bg-[#cccccc]`}>
      <div
      className={`easyleap-absolute easyleap-h-[20px] easyleap-top-0 easyleap-left-0 easyleap-transition-all easyleap-duration-500 easyleap-bg-[#9debb2]`}
      style={{ width: `${progress}%` }}
      />
      <div className="`easyleap-absolute easyleap-w-full easyleap-h-full easyleap-top-0 easyleap-left-0 easyleap-flex easyleap-items-center easyleap-justify-center easyleap-text-sm easyleap-font-semibold">
      </div>
      <div className='easyleap-absolute easyleap-w-full easyleap-h-full easyleap-top-0 easyleap-left-0 easyleap-flex easyleap-items-center easyleap-justify-center easyleap-text-sm easyleap-font-semibold easyleap-text-black'>{timeLeftStr}</div>
    </div>
  );
};

export default ProgressBar;
