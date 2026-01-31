import React from 'react'
import { buildStyles, CircularProgressbar, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import ChangingProgressProvider from '../ChangingProgressProvider';
import AnimatedProgressProvider from '../AnimatedProgressProvider';

const Demo = () => {
    let percentage=66
  return (
    <div>

<AnimatedProgressProvider
        valueStart={0}
        valueEnd={66}
        duration={1.4}
        // easingFunction={easeQuadInOu}
        repeat
      >
        {value => {
          const roundedValue = Math.round(value);
          return (
            <CircularProgressbar
              value={value}
              text={`${roundedValue}%`}

              styles={buildStyles({ pathTransition: "none" })}
            />
          );
        }}
      </AnimatedProgressProvider>


        {/* <Example label="Arbitrary content"> */}
      {/* <CircularProgressbarWithChildren value={66} styles={buildStyles({ pathTransitionDuration: 0.5,pathColor: `rgba(62, 152, 199, ${66 / 100})`,
    textColor: '#f88',
    trailColor: '#d6d6d6',
    backgroundColor: '#3e98c7',})}>
        <img
          style={{ width: 40, marginTop: -5 }}
          src="https://i.imgur.com/b9NyUGm.png"
          alt="doge"
        />
        <div style={{ fontSize: 12, marginTop: -5 }}>
          <strong>66%</strong> mate
        </div>
      </CircularProgressbarWithChildren> */}

<div style={{ width: 200, height: 200, margin: '20px auto' }}>
      <CircularProgressbarWithChildren
        value={percentage}
        styles={buildStyles({
          // Customize the path (the actual progress bar)
          pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
          // Customize the trail (the path behind the progress bar)
          trailColor: '#f0f0f0',
          // Customize the text
          textColor: '#3e98c7',
          // Customize the background
          backgroundColor: 'transparent',
          // Animation settings
          pathTransitionDuration: 1.5,
          pathTransition: 'easeInOut',
          // Round the line ends
          strokeLinecap: 'round',
          // Text size
          textSize: '16px',
        })}
      >
        {/* Custom content inside the circle */}
        <div style={{ textAlign: 'center' }}>
          <img
            style={{ width: 40, marginBottom: 10 }}
            src="https://i.imgur.com/b9NyUGm.png"
            alt="doge"
          />
          <div style={{ fontSize: 16, fontWeight: 'bold', color: '#3e98c7' }}>
            <strong>{percentage}%</strong>
          </div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 5 }}>
            Progress
          </div>
        </div>
      </CircularProgressbarWithChildren>
    </div>
    <div style={{ width: 150, height: 150 }}>
    <AnimatedProgressProvider
        valueStart={0}
        valueEnd={66}
        duration={1.4}
        // easingFunction={easeQuadInOut}
        repeat
      >
        {value => {
          const roundedValue = Math.round(value);
          return (
            <CircularProgressbar
              value={value}
              text={`${roundedValue}%`}
              /* This is important to include, because if you're fully managing the
        animation yourself, you'll want to disable the CSS animation. */
              styles={buildStyles({ pathTransition: "none" })}
            />
          );
        }}
      </AnimatedProgressProvider>
      </div>
    <ChangingProgressProvider values={[0, 20, 40, 60, 80, 100]}>
        {percentage => (
          <CircularProgressbar
            value={percentage}
            text={`${Math.round(percentage)}%`}
            styles={buildStyles({
              pathTransitionDuration: 0.15
            })}
          />
        )}
      </ChangingProgressProvider>

    <div style={{ width: 200, height: 200 }}>
      <ChangingProgressProvider
        values={[0, 25, 50, 75, 100]} // Values to animate through
        interval={1500} // Duration between values
        // loop={true} // Whether to loop the animation
        // easingFunction={easingFunctions.linear} // Smooth easing
      >
        {(value) => (
          <CircularProgressbar
            value={value}
            text={`${Math.round(value)}%`}
            styles={buildStyles({
              pathColor: `rgba(62, 152, 199, ${value / 100})`,
              trailColor: '#f0f0f0',
              textColor: '#3e98c7',
              pathTransitionDuration: 0.5,
            })}
          />
        )}
      </ChangingProgressProvider>
    </div>
    </div>
  )
}

export default Demo