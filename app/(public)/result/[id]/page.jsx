import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import Image from "next/image"
import ShareResult from "@/components/shared/ShareResult";
import NotFound from "@/app/not-found";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ResultCard from "@/components/shared/ResultCard";

export const metadata = {
  title: 'Results | 5 Second Song',
}

const ResultPage = async (props) => {
  const params = await props.params

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: resultData } = await supabase.from('results').select().eq('id', params.id).single()

  if (!resultData) return <NotFound />

  const artistInfo = resultData.artist_details || null

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="container py-4 flex flex-col items-center">
      {/* signed out banner */}
      {user ? null : <div className="p-2 border border-border text-foreground rounded-md bg-card w-full max-w-md mb-4">
        <p className="text-center text-sm text-">You're not signed in. <Link href={`/sign-in?next=/api/link-result?id=${resultData.id}`} className="font-bold text-primary underline">Sign in</Link> to save your results and show them off on the leaderboard!</p>
      </div>}

      {/* card */}
      <ResultCard artistInfo={artistInfo} resultData={resultData} mode={resultData.mode} />

      <ShareResult artist={artistInfo?.name} score={resultData.score} time={resultData.time} />

      <div className="mt-4">
        <Link href='/leaderboard'>
          <Button variant='link'>View Leaderboard</Button>
        </Link>

        {user && (
          <Link href='/profile'>
            <Button variant='link'>View Profile</Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default ResultPage