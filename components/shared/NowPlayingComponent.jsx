'use client'

import { connectToSpotify, getSpotifyNowPlaying } from "@/actions/spotify"
import { Music2 } from "lucide-react"
import { useEffect, useState } from "react"

const NowPlayingComponent = () => {
  const [nowPlaying, setNowPlaying] = useState(null)

  useEffect(() => {
    async function fetchNowPlaying() {
      const response = await getSpotifyNowPlaying()
      
      setNowPlaying(response)
    }

    fetchNowPlaying() // Initial fetch

    const interval = setInterval(fetchNowPlaying, 30000) // Refresh every 30s

    return () => clearInterval(interval) // Cleanup on unmount
  }, [])

  if (!nowPlaying) return false


  return (
    <div className="bg-primary/10 backdrop-blur-sm rounded-md flex items-center gap-4 mt-2 pr-4">
      <div className="flex-shrink-0 relative">
        {nowPlaying.albumArt ? (
          <img src={nowPlaying.albumArt || "/placeholder.svg"} alt="Album Art" className="w-12 rounded-md h-12" />
        ) : (
          <div className="w-12 h-12 rounded-md bg-primary/20 flex items-center justify-center">
            <Music2 className="w-6 h-6 text-primary" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-primary rounded-full animate-ping" />
        </div>
      </div>

      <div className="flex-grow">
        <p className="font-medium text-sm truncate">{nowPlaying.songName}</p>
        <p className="text-xs text-muted-foreground truncate">{nowPlaying.artistName}</p>
      </div>
    </div>
  )
}

export default NowPlayingComponent