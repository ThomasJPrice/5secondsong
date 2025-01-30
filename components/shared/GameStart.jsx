'use client'

import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ModeChooser from './ModeChooser'
import { Button } from '../ui/button'
import { Info, LoaderCircle } from 'lucide-react'
import { getSpotifyStatus } from '@/actions/spotify'
import ArtistSelection from './ArtistSelection'
import PlaylistSelection from './PlaylistSelection'
import toast from 'react-hot-toast'
import { FaInfoCircle } from 'react-icons/fa'

// 1. choose data source - either artist or spotify playlist if connected
// 2. choose game mode - classic or lyrics with selector component

const GameStart = () => {
  const [mode, setMode] = useState(null)
  const [source, setSource] = useState('artist')

  const [playlistValue, setPlaylistValue] = useState("")
  const [artistValue, setArtistValue] = useState("")

  const [loading, setLoading] = useState(false)

  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false)

  useEffect(() => {
    async function checkSpotifyConnection() {
      const response = await getSpotifyStatus()

      setIsSpotifyConnected(response.status)
    }

    checkSpotifyConnection()
  }, [])
  

  const startQuiz = () => {
    setLoading(true)

    if (!mode) {
      toast.error('Please select a mode')
      setLoading(false)
      return
    }

    if (source === 'playlist') {
      if (!playlistValue) {
        toast.error('Please select a playlist')
        setLoading(false)
        return
      }

      window.location.href=`/${mode}/${playlistValue.id}?source=${source}`
      
    } else {
      if (!artistValue) {
        toast.error('Please select a artist')
        setLoading(false)
        return
      }

      window.location.href=`/${mode}/${artistValue.id}?source=${source}`

    }
  }

  return (
    <div className='flex flex-col gap-8 items-center mt-8'>
      {/* choose data source */}
      <Tabs value={source} onValueChange={setSource} className='w-full max-w-[632px]'>
        <TabsList className='w-full flex justify-center gap-4'>
          <TabsTrigger className='flex-1 data-[state=active]:bg-purple-500 data-[state=active]:text-white' value="artist">Choose an artist</TabsTrigger>

          <TabsTrigger disabled={!isSpotifyConnected} className='flex-1 data-[state=active]:bg-purple-500 data-[state=active]:text-white' value="playlist">
            {isSpotifyConnected ? "Choose a playlist" : "Connect Spotify"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="artist" className='flex justify-center mt-4 w-full'>
          <ArtistSelection value={artistValue} setValue={setArtistValue} />
        </TabsContent>

        <TabsContent value="playlist" className='flex flex-col items-center gap-4 mt-0 w-full'>
          <p className='flex gap-2 items-center border rounded-md px-2 py-1'><FaInfoCircle className='flex-shrink-0' /> Results with Playlist mode won't show up on the public leaderboard!</p>
          <PlaylistSelection value={playlistValue} setValue={setPlaylistValue} />
        </TabsContent>
      </Tabs>

      <ModeChooser mode={mode} setMode={setMode} />

      <Button onClick={startQuiz} disabled={loading}>{loading ? <LoaderCircle className="animate-spin" /> : 'Start Quiz'}</Button>
    </div>
  )
}

export default GameStart