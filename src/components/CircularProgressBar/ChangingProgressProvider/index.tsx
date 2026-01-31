// import React, { useEffect, useState } from 'react';

// interface ChangingProgressProviderProps {
//   values: number[];
//   interval?: number;
//   loop?: boolean;
//   easingFunction?: (t: number) => number;
//   children: (value: number) => React.ReactNode;
// }

// const ChangingProgressProvider: React.FC<ChangingProgressProviderProps> = ({
//   values,
//   interval = 1000,
//   loop = true,
//   easingFunction = (t) => t, // Linear easing by default
//   children
// }) => {
//   const [valueIndex, setValueIndex] = useState(0);
//   const [progress, setProgress] = useState(values[0]);
//   const [startTime, setStartTime] = useState<number | null>(null);

//   useEffect(() => {
//     if (values.length === 0) return;

//     const animate = (timestamp: number) => {
//       if (!startTime) setStartTime(timestamp);
//       const elapsed = timestamp - (startTime || timestamp);
//       const progressRatio = Math.min(elapsed / interval, 1);
//       const easedProgress = easingFunction(progressRatio);

//       const currentValue = values[valueIndex];
//       const nextValue = values[(valueIndex + 1) % values.length];
//       const interpolatedValue = currentValue + (nextValue - currentValue) * easedProgress;

//       setProgress(interpolatedValue);

//       if (progressRatio < 1) {
//         requestAnimationFrame(animate);
//       } else {
//         // Move to next value
//         if (valueIndex < values.length - 1 || loop) {
//           setValueIndex((prev) => (prev + 1) % values.length);
//           setStartTime(null);
//         }
//       }
//     };

//     const animationId = requestAnimationFrame(animate);

//     return () => cancelAnimationFrame(animationId);
//   }, [valueIndex, interval, values, loop, easingFunction, startTime]);

//   return <>{children(progress)}</>;
// };

// // Example easing functions
// export const easingFunctions = {
//   linear: (t: number) => t,
//   easeInQuad: (t: number) => t * t,
//   easeOutQuad: (t: number) => t * (2 - t),
//   easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
// };

// export default ChangingProgressProvider;

import React, { useEffect, useState } from "react";

type ChangingProgressProviderProps = {
  values: number[];
  interval?: number;
  children: (value: number) => React.ReactNode;
};

const ChangingProgressProvider: React.FC<ChangingProgressProviderProps> = ({
  values,
  interval = 1000,
  children
}) => {
  const [valuesIndex, setValuesIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setValuesIndex((prevIndex) => (prevIndex + 1) % values.length);
    }, interval);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [values.length, interval]);

  return <>{children(values[valuesIndex])}</>;
};

export default ChangingProgressProvider;