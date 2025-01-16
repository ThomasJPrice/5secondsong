import ArtistSelection from "@/components/shared/ArtistSelection";
import ModeChooser from "@/components/shared/ModeChooser";
import Navbar from "@/components/shared/Navbar";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Image from 'next/image'
import Link from "next/link";

export default async function Home() {
  async function handleSignOut() {
    "use server"
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    await supabase.auth.signOut()
  }

  return (
    <main className="flex">
      {/* main centre */}
      <div className="container h-full min-h-screen flex flex-col">
        <Navbar />

        <form action={handleSignOut}>
          <button type="submit">Sign Out</button>
        </form>

        <main className="flex-grow">
          <div className="w-full flex">
            {/* main centre */}
            <div className="container py-4">
              {/* header */}
              <div className="text-center flex flex-col items-center gap-8">
                {/* <h1 className="font-primary text-4xl md:text-5xl text-primary">Guess the Song</h1> */}
                <Image src='/logo-nobg.png' width={1208} height={564} alt="5 Second Song" className="max-w-[300px]" />
              </div>

              <ArtistSelection />
            </div>
          </div>
        </main>

        <footer className="container pt-4">
          <div className="w-full h-[1px] bg-primary"></div>

          <div className="py-2 flex items-center justify-between">
            <p className="text-primary font-semibold">Made by <Link className="underline" href='https://thomasprice.me' target="_blank">Thomas Price</Link></p>

            <Link className="text-primary font-semibold" href='https://github.com/ThomasJPrice/guess-the-song' target="_blank">GitHub</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
