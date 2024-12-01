'use client'

import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Moon, Sun } from 'lucide-react'

const DarkModeToggle = () => {
  const [mounted, setMounted] = useState(false)
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

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