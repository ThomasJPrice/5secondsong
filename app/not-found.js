import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <div className='container py-4 overflow-hidden flex flex-col items-center'>
      <h1 className="font-primary text-center text-4xl md:text-5xl text-primary">404</h1>
      <p className='text-center mt-4'>The page you are looking for can't be found.</p>

      <Link href='/' className='mt-8'>
        <Button>Take Me Home</Button>
      </Link>
    </div>
  )
}

export default NotFound