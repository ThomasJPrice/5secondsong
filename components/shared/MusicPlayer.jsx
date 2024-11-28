import { Pause, Play, Volume2 } from 'lucide-react'
import { useEffect, useRef, useState } from "react"
import { Slider } from '../ui/slider'
import SoundBars from './SoundBars'

const MusicPlayer = ({ isPlaying, setIsPlaying, trackSrc, volume, setVolume }) => {
  const audioRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [startTime, setStartTime] = useState(0)

  useEffect(() => {
    const randomStart = Math.floor(Math.random() * 25)
    setStartTime(randomStart)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime - startTime
      if (currentTime >= 5) {
        audio.pause()
        audio.currentTime = startTime
        setIsPlaying(false)
        setProgress(0)
      } else {
        setProgress((currentTime / 5) * 100)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setProgress(0)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [startTime, setIsPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.play()
    } else {
      audio.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = volume
    }
  }, [volume])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume[0])
  }

  return (
    <div className='mb-8'>
      <div className="max-w-[300px] h-[40px] rounded-full bg-secondary shadow-sm w-full mx-auto border flex">
        <audio ref={audioRef} src={`${trackSrc}#t=${startTime}`} />

        <button
          className="h-full w-[40px] flex-shrink-0 flex justify-center items-center bg-primary rounded-full text-white"
          onClick={togglePlayPause}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </button>

        <SoundBars progress={progress} />
      </div>

      <div className="flex items-center mx-auto gap-2 mt-4 max-w-[200px]">
        <Volume2 className="h-4 w-4 text-primary" />
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={[volume]}
          onValueChange={handleVolumeChange}
          aria-label="Volume"
        />
      </div>
    </div>
  )
}

export default MusicPlayer

