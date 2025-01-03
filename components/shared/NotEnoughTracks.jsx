import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

const NotEnoughTracks = () => {
  return (
    <div className='container py-4 overflow-hidden flex flex-col items-center'>
      <h1 className="font-primary text-center text-4xl md:text-5xl text-primary">Not enough tracks!</h1>
      <p className='text-center mt-4'>Sorry! The artist you choose must have at least 10 tracks to generate a proper quiz.</p>

      <Link href='/' className='mt-8'>
        <Button>Choose a different artist</Button>
      </Link>
    </div>
  )
}

export default NotEnoughTracks