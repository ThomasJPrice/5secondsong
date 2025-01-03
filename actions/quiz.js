'use server'

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function handleQuizSubmit({ deezer_artist_id, artist_details, score, time, mode }) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
  
    const { data, error } = await supabase
      .from('results')
      .insert({
        deezer_artist_id: deezer_artist_id,
        artist_details: artist_details,
        score: score,
        time: time,
        mode: mode
      })
      .select()
      .single()
  
    if (error) throw new Error(error)
    
    return data?.id
  } catch (err) {
    console.error(err)
  }
}