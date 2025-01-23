import ProfileMakerForm from '@/components/shared/ProfileMakerForm'
import UsernameSelector from '@/components/shared/UsernameSelector'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const SignUpStageTwo = async (params) => {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const searchParams = await params.searchParams
  const redirectUrl = searchParams.next || '/me'

  // checking user status
  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-up')
  }

  const { data: userData, error: userError } = await supabase.from('users').select().eq('id', user.id).maybeSingle()

  if (userData) {
    redirect(redirectUrl)
  }

  return (
    <div className='min-h-screen relative w-full flex justify-center items-center'>
      <Card className="w-full max-w-md shadow-md m-4">
        <CardHeader>
          <Image src='/logo-nobg.png' alt='5 Second Song' width={1095} height={435} className='h-[80px] w-fit object-contain mx-auto mb-2' />
          <h1 className='text-2xl font-primary text-primary text-center'>Welcome to 5 Second Song!</h1>
          <p className='text-center'>Let's get your profile rocking so you can show off your quiz results!</p>
        </CardHeader>

        <CardContent>
          <ProfileMakerForm redirectUrl={redirectUrl} />
        </CardContent>
      </Card >
    </div>
  )
}

export default SignUpStageTwo