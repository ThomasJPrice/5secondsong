'use server'

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function handleQuizSubmit(spotifyArtistId, deezerArtistId, score, time) {

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('results')
    .insert({
      spotify_artist_id: spotifyArtistId,
      deezer_artist_id: deezerArtistId,
      score: score,
      time: time
    })
    .select()
    .single()
  
  console.log(error);
  

  return data?.id
}