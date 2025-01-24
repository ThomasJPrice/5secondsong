import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const SettingsPage = () => {
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
            hi
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-primary font-primary tracking-normal'>Connections</CardTitle>
            <CardDescription>Manage your connections with our partners.</CardDescription>
          </CardHeader>

          <CardContent>
            hi
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-primary font-primary tracking-normal'>Account</CardTitle>
            <CardDescription>Control your account information and settings.</CardDescription>
          </CardHeader>

          <CardContent>
            hi
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default SettingsPage