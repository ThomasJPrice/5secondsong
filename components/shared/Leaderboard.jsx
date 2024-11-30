import Image from 'next/image'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import LeaderboardArtist from './LeaderboardArtist'

const Leaderboard = ({ entries }) => {
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
            <TableRow key={entry.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <LeaderboardArtist id={entry.spotify_artist_id} />
              </TableCell>
              <TableCell className="text-right">{entry.score}</TableCell>
              <TableCell className="text-right">{formatTime(entry.time)}s</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Leaderboard