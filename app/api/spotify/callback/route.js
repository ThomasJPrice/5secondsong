import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams

  const code = searchParams.get('code')

  if (!code) {
    console.log('No code found in query params');
    return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/link/spotify?error=true`)
  }
  
  try {
    const url = `https://accounts.spotify.com/api/token`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${process.env.NEXT_PUBLIC_URL}/api/spotify/callback`
      })
    })

    const data = await response.json()

    if (data.error) return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/link/spotify?error=true`)

    // getting current user
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

    const cookieStore = await cookies()
    const supabaseClient = createServerClient(cookieStore)

    const { data: { user} } = await supabaseClient.auth.getUser()

    if (!user) return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/link/spotify?error=true`)


    // has user, has data, now update user
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        spotify_access_token: data.access_token,
        spotify_refresh_token: data.refresh_token,
        spotify_expires_at: new Date().getTime() + (data.expires_in * 1000)
      })
      .match({ id: user.id })
    
    return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/`)

  } catch (error) {
    console.log(error);
    return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/link/spotify?error=true`)
  }

}