import { easeQuadInOut } from "d3-ease";
import React, { useEffect, useState } from "react";
import { Animate, HashMap } from "react-move";


type AnimatedProgressProviderProps = {
  valueStart?: number;
  valueEnd: number;
  duration: number;
  easingFunction?: (normalizedTime: number) => number;
  repeat?: boolean;
  children: (value: number) => React.ReactNode;
};

const AnimatedProgressProvider: React.FC<AnimatedProgressProviderProps> = ({
  valueStart = 0,
  valueEnd,
  duration,
  easingFunction=easeQuadInOut,
  repeat = false,
  children
}) => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    if (repeat) {
      const intervalId = setInterval(() => {
        setIsAnimated(prev => !prev);
      }, duration * 1000);
      return () => clearInterval(intervalId);
    }
    setIsAnimated(true);
  }, [repeat, duration]);

  return (
    <Animate
      start={() => ({
        value: valueStart
      })}
      update={() => ({
        value: [isAnimated ? valueEnd : valueStart],
        // value: [valueEnd],
        timing: {
          duration: duration * 1000,
          ease: easingFunction
        }
      })}
    >
        {/* @ts-ignore */}
        {({ value }) => children(value)}
    </Animate>
  );
};

export default AnimatedProgressProvider;