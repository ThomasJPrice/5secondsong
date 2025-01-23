'use client'

import { useState } from "react"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import ProfileImageUploader from "./ProfileImageUploader"
import toast from "react-hot-toast"
import { LoaderCircle } from "lucide-react"
import { checkUniqueUsername, createProfile } from "@/actions/login"
import { useRouter } from "next/navigation"

const ProfileMakerForm = ({ redirectUrl }) => {
  const [username, setUsername] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  async function handleContinue() {
    try {
      setIsLoading(true)

      // check username
      if (!username) {
        toast.error('Please enter a username')
        return
      }

      if (username.length < 3) {
        toast.error('Username must be at least 3 characters long')
        return
      }

      // check if username is unique
      const unique = await checkUniqueUsername(username)

      if (!unique) {
        toast.error('Username is already taken')
        return
      }

      const ok = /^[a-zA-Z0-9_-]+$/.test(username)

      if (!ok) {
        toast.error('Username can only contain letters, numbers, hyphens, and underscores')
        return
      }

      // upload image if there is one
      var imageUrl = await fetch('/api/profile-image').then(res => res.json()).then(data => data.url) || null;

      if (selectedFile) {
        const form = new FormData()
        form.append('username', username)
        form.append('profile_image', selectedFile)

        const response = await fetch('/api/profile-image', {
          method: 'POST',
          body: form,
        })

        const data = await response.json()

        if (data.error) {
          toast.error(data.error)
        } else {
          imageUrl = data.url
        }
      }

      const { error: createError } = await createProfile(username, imageUrl)

      if (createError) {
        console.log(createError);
      }
      
      router.push(redirectUrl)

    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <ProfileImageUploader selectedFile={selectedFile} setSelectedFile={setSelectedFile} />

      <div>
        <Label>Username <span className="text-red-600">*</span></Label>

        <Input value={username} onChange={(e) => setUsername(e.target.value)} className='my-2' />
      </div>

      <Button onClick={handleContinue} className='w-full mt-4'>
        {isLoading ? <LoaderCircle className="animate-spin" /> : 'Continue'}
      </Button>
    </div>
  )
}

export default ProfileMakerForm