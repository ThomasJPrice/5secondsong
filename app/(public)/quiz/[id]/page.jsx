import Image from "next/image";
import QuizContainer from "@/components/shared/QuizContainer";
import NotFound from "@/app/not-found";
import { createClassicQuizData, getArtistInfo } from "@/actions/deezer";

export async function generateMetadata(props) {
  const params = await props.params

  const artistInfo = await getArtistInfo(params.id)

  return {
    title: `${artistInfo.name} | 5 Second Song`,
    description: `Can you guess 10 of ${artistInfo.name}'s songs within 5 seconds of hearing each one?`
  }
}

const Quiz = async (props) => {
  const params = await props.params

  const artistInfo = await getArtistInfo(params.id)
  const quizData = await createClassicQuizData(params.id)

  if (!artistInfo || !quizData) return (
    <NotFound />
  )

  return (
    <div className="container py-4 overflow-hidden">
      <QuizContainer
        artistDetails={artistInfo}
        quizData={quizData}
      />
    </div>
  )
}

export default Quiz