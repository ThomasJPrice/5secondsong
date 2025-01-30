'use server'

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation"

export async function redirectToConnection() {
  redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=playlist-read-private,user-read-currently-playing&redirect_uri=${process.env.NEXT_PUBLIC_URL}/api/spotify/callback`);
}

export async function getSpotifyStatus() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return {
    status: false
  }

  const { data: userData } = await supabase.from('users').select().eq('id', user.id).single()

  if (!userData) return {
    status: false
  }

  const status = userData.spotify_access_token !== null

  if (status) {
    return {
      status: true,
      access_token: userData.spotify_access_token,
      refresh_token: userData.spotify_refresh_token,
      expires_at: userData.spotify_expires_at
    }
  } else return {
    status: false
  }
}


export async function disconnectSpotify() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  await supabase.from('users').update({
    spotify_access_token: null,
    spotify_refresh_token: null,
    spotify_expires_at: null
  }).eq('id', user.id)

  return true
}

export async function connectToSpotify() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase.from('users').select().eq('id', user.id).single()

  const spotify_access_token = userData.spotify_access_token
  const spotify_refresh_token = userData.spotify_refresh_token
  const spotify_expires_at = userData.spotify_expires_at

  if (!spotify_access_token || !spotify_refresh_token || !spotify_expires_at) {
    // not connected to spotify
    return false
  }


  if (new Date(parseInt(spotify_expires_at)) < new Date()) {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: spotify_refresh_token,
      })
    })

    const data = await response.json()

    if (data.access_token) {
      await supabase.from('users').update({
        spotify_access_token: data.access_token,
        spotify_expires_at: new Date().getTime() + data.expires_in * 1000
      }).eq('id', user.id)

      return {
        access_token: data.access_token
      }
    } else {
      return false
    }
    
    
  } else {
    return { 
      access_token: spotify_access_token,
    }
  }
  
}



export async function getSpotifyNowPlaying() {
  const connection = await connectToSpotify()

  if (!connection) {
    return null
  }
  
  const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      'Authorization': 'Bearer ' + connection.access_token
    }
  })

  const data = await response.json()

  if (data.error) {
    return null
  }

  if (data.is_playing === false) {
    return null
  }

  return {
    songName: data.item.name,
    artistName: data.item.artists[0].name,
    albumArt: data.item.album.images[0].url
  }
}



export async function getSpotifyPlaylists() {
  const connection = await connectToSpotify()

  if (!connection) {
    return null
  }

  const response = await fetch('https://api.spotify.com/v1/me/playlists', {
    headers: {
      'Authorization': 'Bearer ' + connection.access_token
    }
  })

  const data = await response.json()

  if (data.error) {
    console.log(data.error);
    
    return null
  }

  return data.items.map(item => {
    return {
      id: item.id,
      name: item.name,
      image: item.images ? item.images[0].url : null
    }
  })
}




export async function getPlaylistInfo(id) {
  const connection = await connectToSpotify()

  if (!connection) {
    return null
  }

  const response = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
    headers: {
      'Authorization': 'Bearer ' + connection.access_token
    }
  })

  const data = await response.json()

  if (data.error) {
    return null
  }

  return {
    id: data.id,
    name: data.name,
    image: data.images[0].url
  }
}

export async function getPlaylistTracks(id) {
  const connection = await connectToSpotify()

  if (!connection) {
    return null
  }

  const response = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
    headers: {
      'Authorization': 'Bearer ' + connection.access_token
    }
  })

  const data = await response.json()

  if (!data.items) {
    return null
  }

  return data.items
    .map((item) => item.track)
    .filter((track) => track) // Remove any null entries
    .map((track) => ({
      name: track.name,
      artist: track.artists[0].name
    }))
}
