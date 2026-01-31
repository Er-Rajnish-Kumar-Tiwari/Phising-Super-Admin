import React, { useEffect } from 'react'
type otpProps = {
  counter: number
  setCounter: (value: React.SetStateAction<number>) => void
  handleClick: React.MouseEventHandler<HTMLButtonElement>
}
export const OTPTimer = ({
  counter = 0,
  setCounter,
  handleClick,
}: otpProps) => {
  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined
    if (counter > 0) timer = setInterval(() => setCounter(counter - 1), 1000)
    return () => clearInterval(timer)
  }, [counter, setCounter])

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={counter !== 0}
        type='button'
        className={`${counter !== 0 ? 'cursor-not-allowed lg:text-gray-400' : 'text-brand cursor-pointer font-semibold underline'}`}
      >
        Resend OTP
        <span className='text-brand text-base font-semibold'>
          {/* OTP  */}
          {counter !== 0 ? ` (${counter} sec)` : null}
        </span>
      </button>
    </div>
  )
}
