import Image from 'next/image'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from 'next/link'

const Leaderboard = ({ entries, mode }) => {
  const formatTime = (ms) => {
    return (ms / 1000).toFixed(1)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Rank</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead className="text-right">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, index) => (
            <TableRow key={entry.deezer_artist_id + `${index}`}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src={entry.artist_details.image}
                      alt={`Image for ${entry.artist_details.name}`}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <Link className="hover:underline" href={`/${mode}/${entry.deezer_artist_id}`}>{entry.artist_details.name}</Link>
                </div>
              </TableCell>
              <TableCell className="text-right">{entry?.score}</TableCell>
              <TableCell className="text-right">{formatTime(entry?.time)}s</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Leaderboard