'use client';

import { useState } from 'react';
import { Combobox } from '@/components/ui/combobox';

const ArtistSelection = () => {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchArtists(searchTerm) {
    if (!searchTerm) {
      setOptions([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodeURIComponent(
          searchTerm
        )}&api_key=${process.env.NEXT_PUBLIC_LASTFM_API_KEY}&format=json`
      );

      const data = await response.json();

      if (data.results?.artistmatches?.artist) {
        const artists = data.results.artistmatches.artist.map((artist) => ({
          value: artist.name,
          label: artist.name,
        }));
        setOptions(artists);
      } else {
        setOptions([]);
      }
    } catch (error) {
      console.error('Error fetching artists:', error);
      setOptions([]);
    }

    setLoading(false);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Combobox
        placeholder="Search for an artist..."
        value={query}
        onChange={(value) => setQuery(value)}
        onInputChange={(value) => fetchArtists(value)}
        options={options}
        loading={loading}
      />
    </div>
  );
};

export default ArtistSelection;
