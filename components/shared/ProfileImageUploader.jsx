'use client'

import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import Image from "next/image"
import { Input } from "../ui/input"

const ProfileImageUploader = ({ selectedFile, setSelectedFile}) => {
  const [profileUrl, setProfileUrl] = useState(null)

  useEffect(() => {
    async function fetchCurrent() {
      const data = await fetch('/api/profile-image')
      const body = await data.json()
      
      setProfileUrl(body.url)
    }

    fetchCurrent()
  }, [])

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.")
      return
    }

    setSelectedFile(file)
    setProfileUrl(URL.createObjectURL(file))
  }

  return (
    <div>
      <Label htmlFor="profile-picture">Profile Picture <span className="text-gray-600">(optional)</span></Label>

      <div className="flex items-center space-x-4 my-2">
        {/* Image Preview */}
        <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
          {profileUrl && (
            <Image
              src={profileUrl}
              alt="Profile Picture"
              className="object-cover w-full h-full flex-shrink-0"
              width={64}
              height={64}
            />
          )}
        </div>

        {/* File Input */}
        <div>
          <Input
            id="profile-picture"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className=""
          />
        </div>
      </div>
    </div>
  )
}

export default ProfileImageUploader
