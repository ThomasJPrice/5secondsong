import NotFound from '@/app/not-found'
import UserResults from '@/components/shared/UserResults'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Image from 'next/image'
import React from 'react'

export async function generateMetadata(props) {
  const params = await props.params

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: userData } = await supabase.from('users').select().eq('username', params.username).maybeSingle()

  if (!userData) return { title: 'User not found', description: 'The user you are looking for does not exist' }

  return {
    title: `${userData.username} | 5 Second Song`,
    description: `Profile page for ${userData.username}`,
    image: userData.profile_image,
  }
}

const UserPage = async (props) => {
  const params = await props.params

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: userData } = await supabase.from('users').select().eq('username', params.username).maybeSingle()

  if (!userData) return <NotFound />

  const joinedAt = new Date(userData.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })


  return (
    <div className='container py-4'>
      <div className='flex gap-8 items-center'>
        <Image src={userData.profile_image} width={96} height={96} alt={`Image for ${userData.username}`} className='rounded-full' />

        <div>
          <h1 className='font-primary text-3xl md:text-4xl text-primary'>{userData.username}</h1>
          <p>Joined: {joinedAt}</p>
        </div>
      </div>

      <section id='results'>
        <h2 className='font-primary text-xl md:text-2xl text-primary mt-8'>Results</h2>

        <UserResults userId={userData.id} />
      </section>
    </div>
  )
}

export default UserPage