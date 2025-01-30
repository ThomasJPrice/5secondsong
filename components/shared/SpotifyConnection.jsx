'use client'

import { disconnectSpotify, getSpotifyStatus, redirectToConnection } from "@/actions/spotify"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { LoaderCircle } from "lucide-react"
import Image from "next/image"

const SpotifyConnection = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkConnection() {
      const { status } = await getSpotifyStatus()

      if (status) {
        setIsConnected(true)
      } else {
        setIsConnected(false)
      }

      setIsLoading(false)
    }

    checkConnection()
  }, [])

  const handleToggleConnection = async () => {
    if (isLoading) return

    if (isConnected) {
      setIsLoading(true)

      await disconnectSpotify()

      setIsLoading(false)
      setIsConnected(false)
    } else {
      setIsLoading(true)

      await redirectToConnection()
    }
  }

  return (
    <Card className="w-full md:w-1/2">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Image src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png" alt="Spotify" width={48} height={48} />
        <div className="flex-1">
          <CardTitle>Spotify</CardTitle>
          <CardDescription className='mt-1'>Utilise features like quizzing with your Spotify playlists (coming soon!)</CardDescription>
        </div>
      </CardHeader>
      <CardFooter className='mt-4'>
        {isLoading ? (
          <Button disabled className='w-full'><LoaderCircle className="animate-spin" /></Button>
        ) : (
          <Button
            variant={isConnected ? "destructive" : "default"}
            className="w-full"
            onClick={handleToggleConnection}
          >
            {isConnected ? "Disconnect" : "Connect to Spotify"}
          </Button>
        )}
      </CardFooter>
    </Card >
  )
}

export default SpotifyConnection