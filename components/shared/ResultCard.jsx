import Image from 'next/image'
import React from 'react'

function calculateTime(time) {
  var secs = time / 1000
  return secs.toFixed(1)
}

const ResultCard = ({ artistInfo, resultData, mode }) => {
  return (
    <div id="result-card" className="w-full bg-background max-w-[350px] border border-primary p-4 rounded-[0.5rem] shadow-lg flex flex-col">
      {artistInfo ? <div>
        <Image priority src={artistInfo.image} width={400} height={400} className="rounded-[0.3rem]" alt={`Cover image for ${artistInfo.name}`} />
      </div> : <div>
        <Image priority src='/placeholder.jpg' className="rounded-[0.3rem]" width={360} height={360} alt="Placeholder artist image" />
      </div>}

      <div className="mt-4 px-2 flex flex-col items-center justify-between flex-grow">
        <div className='flex flex-col items-center'>
          <h3 className="text-primary font-primary text-center text-3xl">{artistInfo?.name}</h3>

          <div className='flex gap-1'>
            <h4 className="text-sm bg-primary text-white font-bold px-2 rounded-sm capitalize mt-1">{resultData.mode}</h4>

            <h4 className="text-sm bg-primary text-white font-bold px-2 rounded-sm capitalize mt-1">{resultData.source}</h4>
          </div>
        </div>

        <div className="flex justify-between mt-2 w-full">
          <div className="flex flex-col items-center">
            <p className="text-sm">Score</p>
            <p className="text-2xl font-primary text-primary">{resultData.score}/10</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-sm">Time</p>
            <p className="text-2xl font-primary text-primary">{calculateTime(resultData.time)}s</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultCard