import { getUser, getUserInfo } from '@/actions/login'
import BooleanSetting from '@/components/shared/BooleanSetting'
import SpotifyConnection from '@/components/shared/SpotifyConnection'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import React from 'react'

export const metadata = {
  title: 'Settings | 5 Second Song'
}

const SettingsPage = async () => {
 const userInfo = await getUser()

  return (
    <div className='container py-4'>
      <h1 className='font-primary text-center text-4xl md:text-5xl text-primary'>Settings</h1>

      <section className='grid grid-cols-1 gap-4 mt-8'>
        <Card>
          <CardHeader>
            <CardTitle className='text-primary font-primary tracking-normal'>Profile</CardTitle>
            <CardDescription>Update your profile and preferences for what is displayed publically.</CardDescription>
          </CardHeader>

          <CardContent>
            <div>
              <BooleanSetting
                initialValue={userInfo.settings?.now_playing}
                name={'now_playing'}
                title='Now Playing'
                description='Display the song you are currently listening to on your profile.'
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-primary font-primary tracking-normal'>Connections</CardTitle>
            <CardDescription>Manage your connections with our partners.</CardDescription>
          </CardHeader>

          <CardContent>
            <SpotifyConnection />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-primary font-primary tracking-normal'>Account</CardTitle>
            <CardDescription>Control your account information and settings.</CardDescription>
          </CardHeader>

          <CardContent>
            <p className='text-gray-500'>Coming soon!</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default SettingsPage