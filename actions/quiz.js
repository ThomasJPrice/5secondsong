'use server'

import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from '@/utils/supabase/server';
import { cookies } from "next/headers"

export async function handleQuizSubmit({ deezer_artist_id, artist_details, score, time, mode }) {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

    const cookieStore = await cookies()
    const supabaseServerClient = createServerClient(cookieStore)

    const { data: {user} } = await supabaseServerClient.auth.getUser()

  
    const { data, error } = await supabase
      .from('results')
      .insert({
        deezer_artist_id: deezer_artist_id,
        artist_details: artist_details,
        score: score,
        time: time,
        mode: mode,
        user_id: user ? user.id : null
      })
      .select()
      .single()
  
    if (error) {
      console.log(error);
      throw new Error(error)
    }
    
    return data?.id
  } catch (err) {
    console.error(err)
  }
}