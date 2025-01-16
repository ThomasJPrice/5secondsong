import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import sharp from "sharp";

export async function GET(request) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user }, error } = await supabase.auth.getUser()

  // check if user exists in supabase
  if (!user) {
    return Response.redirect('/')
  }

  const { data: userData, error: userError } = await supabase.from('users').select().eq('id', user.id).maybeSingle()

  if (!userData || !userData?.profile_image_url) {
    const oauthImage = user?.user_metadata?.avatar_url

    if (oauthImage) {
      return Response.json({ url: oauthImage })
    }
  }

  if (userData?.profile_image_url) {
    return Response.json({ url: userData.profile_image_url })
  }

  return Response.json({ url: 'https://5secondsong.tech/icon.png' });
}

export async function POST(request) {
  const supabase = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

  try {
    const formData = await request.formData()
    const file = formData?.get('profile_image')

    if (file === 'null' || !file.type.startsWith('image/')) {
      return Response.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const optimisedBuffer = await sharp(buffer)
      .resize(512, 512)
      .jpeg({ quality: 80 })
      .toBuffer()

    const uniqueFilename = `public/${Date.now()}-${formData.get('username')}.jpg`;

    const { data, error} = await supabase.storage.from('profile-images').upload(uniqueFilename, optimisedBuffer, {
      contentType: 'image/jpeg'
    })

    if (error) {
      return Response.json({ error: 'An error occured while uploading profile picture.' }, { status: 500 })
    }

    const { data: {publicUrl} } = supabase.storage.from('profile-images').getPublicUrl(data.path)

    return Response.json({ url: publicUrl }, { status: 200 })
  } catch (error) {
    return Response.json({ error: 'An error occured while uploading profile picture.' }, { status: 500 })
  }
}