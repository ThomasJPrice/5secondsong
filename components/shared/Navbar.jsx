import Link from "next/link"
import { Button } from "../ui/button"
import { Sun } from "lucide-react"
import DarkModeToggle from "./DarkModeToggle"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { checkSignedIn } from "@/actions/login"
import ProfileIcon from "./ProfileIcon"

const Navbar = async () => {
  const signedIn = await checkSignedIn()

  return (
    <nav className="container py-4 flex justify-between items-center">
      {/* left */}
      <ul className="flex">
        <Link href='/'>
          <Button variant='link'>Home</Button>
        </Link>

        <Link href='/leaderboard'>
          <Button variant='link'>Leaderboard</Button>
        </Link>
      </ul>

      <div className="flex gap-4 items-center">
        {signedIn ? (
          <ProfileIcon size={40} link />
        ) : (
          <Link href='/sign-in'>
            <Button>
              Sign In
            </Button>
          </Link>
        )
        }

        <DarkModeToggle />
      </div >
    </nav >
  )
}

export default Navbar 