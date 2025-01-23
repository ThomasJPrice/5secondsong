import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams

  const next = searchParams.get('next')
  const code = searchParams.get('code')

  if (!next || !code) {
    console.log('No next or code present')
    return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/`)
  }

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    if (sessionError) {
      console.error('Error exchanging code for session:', sessionError)
      return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/?error=session-exchange`)
    }

    return Response.redirect(`${process.env.NEXT_PUBLIC_URL}${next}`)
  } catch (error) {
    console.error('Unexpected error during OAuth callback:', error)
    return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/?error=unexpected`)
  }
}
