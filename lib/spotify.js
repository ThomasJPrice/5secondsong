'use server'

let spotifyAccessToken = null;
let tokenExpiryTime = 0;

export async function getSpotifyAccessToken() {
  if (spotifyAccessToken && Date.now() < tokenExpiryTime) {
    return spotifyAccessToken;
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64')}`,
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  });

  const data = await response.json();
  spotifyAccessToken = data.access_token;
  tokenExpiryTime = Date.now() + data.expires_in * 1000;

  return spotifyAccessToken;
}

export async function querySpotifyArtists(query) {
  // get current token, or fetch new one if token has expired
  spotifyAccessToken = await getSpotifyAccessToken()

  try {
    const response = await fetch(`${process.env.SPOTIFY_API_URL}/search?q=${encodeURIComponent(query)}&type=artist&limit=10`, {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    const data = await response.json();
    const artists = data.artists.items.map((artist) => ({
      id: artist.id,
      name: artist.name,
      image: artist.images?.[0]?.url || null,
    }));

    return artists


  } catch (error) {
    console.error('Error querying Spotify:', error);
  }
}

export async function getArtistInfo(id) {
  // get current token, or fetch new one if token has expired
  spotifyAccessToken = await getSpotifyAccessToken()

  try {
    const response = await fetch(`${process.env.SPOTIFY_API_URL}/artists/${encodeURIComponent(id)}`, {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    const data = await response.json();

    return data

  } catch (error) {
    console.error('Error querying Spotify:', error);
  }
} 