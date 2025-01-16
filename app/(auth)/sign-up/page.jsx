import { checkSignedIn } from '@/actions/login'
import LoginCard from '@/components/shared/LoginCard'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata = {
  title: 'Sign Up | 5 Second Song',
}

const SignUpPage = async (props) => {
  const searchParams = await props.searchParams

  const signedIn = await checkSignedIn()

  if (signedIn) redirect(searchParams.next || '/')

  return (
    <div className='min-h-screen relative w-full flex justify-center items-center'>
      <LoginCard mode='signup' redirectUrl={searchParams.next || ''} />
    </div>
  )
}

export default SignUpPage