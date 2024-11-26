import Image from "next/image";
import { createQuizData } from '@/lib/deezer'
import { getArtistInfo } from "@/lib/spotify";
import QuizContainer from "@/components/shared/QuizContainer";

const Quiz = async (props) => {
  const params = await props.params

  const artistInfo = await getArtistInfo(params.id)
  const quizData = await createQuizData(params.id)

  if (!artistInfo || !quizData) return (
    <div>Error fetching quiz information.</div>
  )

  return (
    <div className="container py-4">
      <QuizContainer
        artistDetails={artistInfo}
        quizData={quizData}
      />
    </div>
  )
}

export default Quiz