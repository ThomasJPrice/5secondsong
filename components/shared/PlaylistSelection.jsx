import { getSpotifyPlaylists } from "@/actions/spotify"
import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "../ui/button";
import { ChevronsUpDown } from "lucide-react";


const PlaylistSelection = ({ value, setValue }) => {
  const [playlists, setPlaylists] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPlaylists() {
      setIsLoading(true)
      const response = await getSpotifyPlaylists()
      if (!response) return
      setPlaylists(response)
      setIsLoading(false)
    }
    fetchPlaylists()
  }, [])

  return (
    <Select disabled={isLoading} onValueChange={setValue}>
      <SelectTrigger className="w-[300px] py-2 px-4 font-medium">
        {isLoading ? 'Loading playlists...' : value ? value.name : 'Select a playlist'}
      </SelectTrigger>

      <SelectContent className='overflow-hidden w-[300px]'>
        {playlists.map((playlist) => (
          <SelectItem
            key={playlist.id}
            value={playlist}
            onClick={() => setValue(playlist)}
            className="w-full truncate overflow-hidden text-ellipsis"
          >
            <p className="truncate text-ellipsis">{playlist.name}</p>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default PlaylistSelection