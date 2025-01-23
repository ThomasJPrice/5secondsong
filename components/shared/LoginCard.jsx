'use client'

import { useState } from 'react'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../ui/button'

import { FcGoogle } from 'react-icons/fc'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Github, LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signInWithOAuth, signInWithPassword } from '@/actions/login'
import toast from 'react-hot-toast'

const LoginCard = ({ mode, redirectUrl }) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignInWithOAuth = async (provider) => {
    setLoading(true)
    try {
      const signInError = await signInWithOAuth(provider, mode, redirectUrl)

      if (signInError) {
        toast.error(signInError)
      }
    }
    catch (error) {
      console.error(error)
    }
    finally {
      setLoading(false)
    }
  }

  const handleSignInWithPassword = async (formData) => {
    setLoading(true)
    try {
      const { user, error: signInError } = await signInWithPassword(formData, mode)
      
      // if user, redirect
      if (user) {
        router.push(`/sign-up/stage-two?next=${redirectUrl || '/'}`)
      }
      // if there is an error, toast it
      else {
        if (signInError) {
          toast.error(signInError)
        }
      }
    }
    catch (error) {
      console.error(error)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-md m-4">
      <CardHeader>
        <Link href="/">
          <Image src='/logo-nobg.png' alt='5 Second Song' width={1095} height={435} className='h-[80px] w-fit object-contain mx-auto mb-2' />
        </Link>
      </CardHeader>

      <form action={handleSignInWithPassword}>
        <CardContent className='space-y-4'>
          <Button onClick={() => handleSignInWithOAuth('google')} type='button' variant="outline" className="w-full">
            <FcGoogle className="mr-2 h-4 w-4" />
            Sign {mode === 'signup' ? 'up' : 'in'} with Google
          </Button>

          <Button onClick={() => handleSignInWithOAuth('github')} type='button' variant="outline" className="w-full">
            <Github className="mr-2 h-4 w-4" />
            Sign {mode === 'signup' ? 'up' : 'in'} with GitHub
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email {mode === 'signup' && <span className="text-red-600">*</span>}</Label>
          <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password {mode === 'signup' && <span className="text-red-600">*</span>}</Label>
          <Input id="password" name="password" minLength='8' type="password" required />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button type='submit' className="w-full" disabled={loading}>
          {loading ? (
            <span><LoaderCircle className="animate-spin" /></span>
          ) : (<span>Sign {mode === 'signup' ? 'Up' : 'In'}</span>)}
        </Button>

        {mode === 'signup' ? (
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href={`/sign-in${redirectUrl && `?next=${redirectUrl}`}`} className="underline">
              Sign in
            </Link>
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground">
            Need an account?{" "}
            <Link href={`/sign-up${redirectUrl && `?next=${redirectUrl}`}`} className="underline">
              Sign up
            </Link>
          </div>
        )}
      </CardFooter>
    </form>
    </Card >
  )
}

export default LoginCard