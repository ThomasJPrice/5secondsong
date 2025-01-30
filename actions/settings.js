'use server'

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { getUserInfo } from "./login";

export async function changeBooleanSetting(setting, value) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user }} = await supabase.auth.getUser() 

  const userInfo = await getUserInfo(user.id)

  await supabase.from('users').update({
    settings: {
      ...userInfo.settings,
      [setting]: value
    }
  }).eq('id', user.id)
  
}