import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { createClient as createServerClient } from "@/utils/supabase/server"

export async function GET(request) {
  const resultId = request?.nextUrl?.searchParams.get('id')

  if (!resultId) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/`)
  }
  
  const cookieStore = await cookies()
  const supabaseClient = createServerClient(cookieStore)

  const { data: { user }} = await supabaseClient.auth.getUser()

  if (!user) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/`)
  }

  // clear to update
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

  const { data: resultData, error: updateError } = await supabase.from('results').update({
    user_id: user.id
  }).eq('id', resultId).single()

  return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/`)
}