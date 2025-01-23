import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image'
import { Cog, LogOut, User } from 'lucide-react'

async function logout() {
  'use server'
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  await supabase.auth.signOut()
}

const ProfileIcon = async ({ size }) => {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: userData } = await supabase.from('users').select().eq('id', user.id).maybeSingle()

  if (!userData) return <Link href='/sign-in'><Button>Sign In</Button></Link>

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Image src={userData.profile_image} width={size} height={size} alt={`Image for ${userData.username}`} className='rounded-full' />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <Link href={`/user/${userData.username}`}>
          <DropdownMenuItem>
            <User />
            Profile
          </DropdownMenuItem>
        </Link>

        <Link href='/settings'>
          <DropdownMenuItem>
            <Cog />
            Settings
          </DropdownMenuItem>
        </Link>

        <form action={logout}>
          <button type='submit' className='w-full'>
            <DropdownMenuItem>
              <LogOut />
              Logout
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileIcon