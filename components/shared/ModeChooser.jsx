'use client'

import React, { useState } from 'react'

import { Button } from '../ui/button'
import { MODES } from '@/utils/constants'
import Image from 'next/image'

const ModeChooser = ({ mode: chosenMode, setMode: setChosenMode }) => {
  return (
    <div className='flex flex-col items-center gap-8'>
      <h2 className='text-center text-2xl text-primary font-primary'>2. Choose a mode:</h2>

      {/* modes */}
      <div className='flex flex-col md:flex-row gap-8'>
        {MODES.map((mode, index) => (
          <button
            onClick={() => setChosenMode(mode.slug)}
            key={mode + index}
            className={`flex flex-col items-center outline max-w-[300px] p-4 rounded-lg transition-all duration-150 outline-primary ease-in-out ${chosenMode === mode.slug ? 'outline-4' : 'outline-[1px]'
              }`}
          >
            <Image src={mode.icon} width={125} height={125} alt={mode.name} />

            <h3 className='text-xl text-primary font-primary mt-4'>{mode.name}</h3>

            <p>{mode.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ModeChooser