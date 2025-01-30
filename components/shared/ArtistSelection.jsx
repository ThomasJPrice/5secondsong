'use client'

import { ChevronsUpDown, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ModeChooser from "./ModeChooser";

const ArtistSelection = ({ value, setValue }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Asynchronous search with debounce
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (query === "") {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(`/api/queryArtists?query=${encodeURIComponent(query)}`, {
          signal,
        });

        if (!response.ok) {
          throw new Error("Error fetching artists");
        }

        const data = await response.json();
        setResults(data?.data || []);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching artists:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();

    // Cleanup function to abort previous requests
    return () => controller.abort();
  }, [query]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {value ? value.name : "Select an artist..."}
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
              <div className="py-4 flex justify-center">
                <LoaderCircle className="animate-spin" />
              </div>
            ) : (
              <>
                <CommandEmpty>No artist found.</CommandEmpty>
                <CommandGroup>
                  {results.map((artist) => (
                    <CommandItem
                      key={artist.id}
                      value={artist}
                      onSelect={() => {
                        setValue(artist === value ? "" : artist);
                        setOpen(false);
                      }}
                    >
                      <Image
                        height={32}
                        width={32}
                        src={artist.picture_big ? artist.picture_big : ""}
                        className="aspect-square object-cover rounded-[0.3rem]"
                        alt={artist.name}
                      />
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

  );
};

export default ArtistSelection;
