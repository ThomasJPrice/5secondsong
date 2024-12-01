import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import Image from "next/image"
import ShareResult from "@/components/shared/ShareResult";

function calculateTime(time) {
  var secs = time / 1000
  return secs.toFixed(1)
}

const ResultPage = async (props) => {
  const params = await props.params

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: resultData } = await supabase.from('results').select().eq('id', params.id).single()

  if (!resultData) return <div className="container">No result found.</div>

  const artistInfo = resultData.artist_details || null

  return (
    <div className="container py-4 flex flex-col items-center">
      {/* card */}
      <div id="result-card" className="w-full bg-background max-w-[350px] border border-primary p-4 rounded-[0.5rem] shadow-lg">
        {artistInfo ? <div>
          <Image priority src={artistInfo.image} width={400} height={400} className="rounded-[0.3rem]" alt={`Cover image for ${artistInfo.name}`} />
        </div> : <div>
            <Image priority src='/placeholder.jpg' className="rounded-[0.3rem]" width={360} height={360} alt="Placeholder artist image" />
          </div>}

        <div className="mt-4 px-2">
          <h3 className="text-primary font-primary text-center text-3xl">{artistInfo?.name}</h3>

          <div className="flex justify-between mt-2">
            <div className="flex flex-col items-center">
              <p className="text-sm">Score</p>
              <p className="text-2xl font-primary text-primary">{resultData.score}/10</p>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-sm">Time</p>
              <p className="text-2xl font-primary text-primary">{calculateTime(resultData.time)}s</p>
            </div>
          </div>
        </div>
      </div>

      <ShareResult artist={artistInfo?.name} score={resultData.score} time={resultData.time} />
    </div>
  )
}

export default ResultPage