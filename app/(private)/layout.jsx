import Navbar from '@/components/shared/Navbar'
import Link from 'next/link'
import React from 'react'

const ProtectedLayout = ({ children }) => {
  return (
    <>
      <Navbar />

      <main className="flex-grow">
        {children}
      </main>

      <footer className="container pt-4">
        <div className="w-full h-[1px] bg-primary"></div>

        <div className="py-2 flex items-center justify-between">
          <p className="text-primary font-semibold">Made by <Link className="underline" href='https://thomasprice.me' target="_blank">Thomas Price</Link></p>

          <Link className="text-primary font-semibold" href='https://github.com/ThomasJPrice/guess-the-song' target="_blank">GitHub</Link>
        </div>
      </footer>
    </>
  )
}

export default ProtectedLayout