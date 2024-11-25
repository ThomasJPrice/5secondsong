import Link from "next/link"
import { Button } from "../ui/button"
import { Sun } from "lucide-react"
import DarkModeToggle from "./DarkModeToggle"

const Navbar = () => {
  return (
    <nav className="container py-2 flex justify-between items-center">
      {/* left */}
      <ul className="flex">
        <Link href='/'>
          <Button variant='link'>Home</Button>
        </Link>

        <Link href='#' className="cursor-not-allowed">
          <Button variant='link' disabled >Leaderboard</Button>
        </Link>
      </ul>

      <div className="flex gap-4 items-center">
        <Link href='https://github.com/ThomasJPrice/guess-the-song' target="_blank">
          <Button>
            GitHub
          </Button>
        </Link>

        <DarkModeToggle />
      </div>
    </nav>
  )
}

export default Navbar 