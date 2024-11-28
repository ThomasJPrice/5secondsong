import React from 'react'

const BARS = [8, 9, 17, 15, 16, 19, 16, 13, 9, 12, 22, 12, 21, 10, 16, 12, 15, 8, 17, 5, 22, 15, 21, 13, 19, 7, 12, 18, 21, 5, 9, 16, 12, 17, 21, 20, 9];

const SoundBars = ({ progress }) => {

  function checkPlayed(index) {
    var pcnt = index / BARS.length * 100

    if (progress >= pcnt && progress !== 0) {
      return true
    }
    
    return false
  }

  return (
    <div className="h-[40px] flex-grow py-2 px-4 relative">
      <div className='w-full h-full flex justify-between items-center'>
        {BARS.map((height, index) => (
          <div
            key={height + `${index}`}
            className={`w-[4px] ${checkPlayed(index) ? 'bg-primary' : 'bg-foreground'} rounded-[2px] transition-all ease-in-out`}
            style={{ height: `${height}px` }}
          />
        ))}
      </div>
    </div>
  )
}

export default SoundBars