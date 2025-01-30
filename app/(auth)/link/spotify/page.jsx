import { checkSignedIn } from '@/actions/login'
import { getSpotifyStatus, redirectToConnection } from '@/actions/spotify'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

import { FaSpotify } from 'react-icons/fa'

const LinkSpotify = async (props) => {
  const searchParams = await props.searchParams
  const error = searchParams.error

  const signedIn = await checkSignedIn()

  if (!signedIn) {
    redirect('/sign-in')
  }
  
  const spotifyStatus = await getSpotifyStatus()

  if (spotifyStatus.status) redirect('/settings')

  return (
    <div className='min-h-screen relative w-full flex justify-center items-center'>
      <Card className="w-full max-w-md shadow-md m-4">
        <CardHeader>
        {error === 'true' && (
            <div className="border border-destructive text-destructive p-1 mb-4">
              An error occured while linking Spotify. Please try again or contact support.
            </div>
          )}

          <Link href="/">
            <Image src='/logo-nobg.png' alt='5 Second Song' width={1095} height={435} className='h-[80px] w-fit object-contain mx-auto mb-2' />
          </Link>

          <h1 className='font-primary text-center text-xl md:text-2xl text-primary'>Connect Your Spotify & Level Up Your Music Experience!</h1>
        </CardHeader>

        <form action={redirectToConnection}>
          <CardContent>
            <Button type='submit' className='w-full bg-[#1ED760] hover:bg-[#1Ed760]/90 text-[#fff]'>
              <FaSpotify />
              Connect Spotify
            </Button>
          </CardContent>
        </form>

      </Card >
    </div>
  )
}

export default LinkSpotify