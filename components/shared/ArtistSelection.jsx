'use client'

import { ChevronsUpDown, LoaderCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react"
import { CommandLoading } from "cmdk"
import Image from "next/image"
import Link from "next/link"
import { queryArtists } from "@/actions/deezer"
import ModeChooser from "./ModeChooser"

const ArtistSelection = () => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [mode, setMode] = useState(null)

  useEffect(() => {
    async function fetchResults() {
      if (query === "") return

      setIsLoading(true)

      const artists = await queryArtists(query)

      setResults(artists)
      setIsLoading(false)
    }

    fetchResults()
  }, [query])

  return (
    <div className="flex flex-col gap-8 items-center mt-8">
      <h2 className='text-center text-2xl text-primary font-primary'>1. Choose an artist:</h2>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] justify-between"
          >
            {value
              ?
              value.name
              : "Select an artist..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search artist..."
              value={query}
              onValueChange={(e) => setQuery(e)}
            />
            <CommandList>
              {isLoading ? (
                <CommandLoading className="py-4 flex justify-center">
                  <LoaderCircle className="animate-spin" />
                </CommandLoading>
              ) : (
                <>
                  <CommandEmpty>No artist found.</CommandEmpty>
                  <CommandGroup>
                    {results.map((artist, index) => (
                      <CommandItem
                        key={artist.id + index}
                        value={artist}
                        onSelect={() => {
                          setValue(artist === value ? "" : artist)
                          setOpen(false)
                        }}
                      >
                        <Image height={32} width={32} src={artist.picture_big ? artist.picture_big : ''} className="aspect-square object-cover rounded-[0.3rem]" alt={artist.name} />
                        {artist.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
              
      <ModeChooser mode={mode} setMode={setMode} />

      <Link href={(value && mode) ? `/${mode}/${value.id}` : '#'} aria-disabled={!value || !mode} className={`${(!value || !mode) && 'cursor-not-allowed pointer-events-none'}`}>
        <Button disabled={!value || !mode}>Start Quiz</Button>
      </Link>
    </div>
  )
}

export default ArtistSelection