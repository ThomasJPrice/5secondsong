import Image from "next/image";
import NotFound from "@/app/not-found";
import { createClassicQuizData, getArtistInfo } from "@/actions/deezer";
import QuizContainer from "@/components/shared/QuizContainer";
import NotEnoughTracks from "@/components/shared/NotEnoughTracks";

export async function generateMetadata(props) {
  const params = await props.params

  const artistInfo = await getArtistInfo(params.id)

  return {
    title: `${artistInfo.name} | 5 Second Song`,
    description: `Can you guess 10 of ${artistInfo.name}'s missing lyrics?`
  }
}

const Quiz = async (props) => {
  const params = await props.params

  const artistInfo = await getArtistInfo(params.id)
  const quizData = await createClassicQuizData(params.id)

  if (quizData === 'Not enough tracks') {
    return <NotEnoughTracks />
  }

  if (!artistInfo || !quizData) return (
    <NotFound />
  )

  return (
    <div className="container py-4 overflow-hidden">
      <QuizContainer
        artistDetails={artistInfo}
        quizData={quizData}
        mode='classic'
      />
    </div>
  )
}

export default Quiz