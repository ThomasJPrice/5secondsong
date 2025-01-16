'use server'

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// ==================
// SIGN IN WITH OAUTH
// ==================
export async function signInWithOAuth(provider, mode, next) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const redirectTo = `${process.env.NEXT_PUBLIC_URL}/api/oauth/callback?next=/sign-up/stage-two?next=${next === '' ? '/' : next}`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: redirectTo
    }
  })

  if (data.url) {
    redirect(data.url)
  }

  if (error) return error

}

// =====================
// SIGN IN WITH PASSWORD
// =====================
export async function signInWithPassword(formData, mode) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const email = formData.get("email")
  const password = formData.get("password")

  if (mode === 'signup') {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return {
        user: null,
        error: error.message,
      }
    }

    console.log(user);


    return { user }

  } else if (mode === 'signin') {
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        user: null,
        error: error.message,
      }
    }

    return { user }
  }

  return { user: null }
}



// ===============
// CHECK SIGNED IN
// ===============
export async function checkSignedIn() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: userData, error } = await supabase.auth.getUser()

  if (userData.user) return true

  return false
}



// =====================
// CHECK UNIQUE USERNAME
// =====================
export async function checkUniqueUsername(username) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.from('users').select().eq('username', username).maybeSingle()

  if (data) return false

  return true
}


// ==============
// CREATE PROFILE
// ==============
export async function createProfile(username, imageUrl) {
  const supabaseService = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: {user} } = await supabase.auth.getUser()

  const { data, error } = await supabaseService.from('users').insert({
    id: user.id,
    username,
    profile_image: imageUrl,
  })

  if (error) return { error }

  return { data }
}