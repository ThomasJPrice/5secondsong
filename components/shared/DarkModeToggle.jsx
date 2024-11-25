'use client'

import { useTheme } from 'next-themes'
import React from 'react'
import { Button } from '../ui/button'
import { Moon, Sun } from 'lucide-react'

const DarkModeToggle = () => {
  const { setTheme, theme } = useTheme()

  return (
    <>
      {theme === 'dark' ? (
        <Button variant='outline' size='icon' onClick={() => setTheme('light')}>
          <Sun />
        </Button>
      ) : (
        <Button variant='outline' size='icon' onClick={() => setTheme('dark')}>
          <Moon />
        </Button>
      )}
    </>
  )
}

export default DarkModeToggle