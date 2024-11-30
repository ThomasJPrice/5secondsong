import { getArtistInfo } from "@/lib/spotify"
import Image from "next/image";
import Link from "next/link";

const LeaderboardArtist = async ({ id }) => {
  const artist = await getArtistInfo(id)

  return (
    <div className="flex items-center space-x-3">
      <div className="relative w-10 h-10">
        <Image
          src={artist.images[0].url}
          alt={`Image for ${artist.name}`}
          fill
          className="rounded-full object-cover"
        />
      </div>
      <Link className="hover:underline" href={`/quiz/${id}`}>{artist.name}</Link>
    </div>
  )
}

export default LeaderboardArtist