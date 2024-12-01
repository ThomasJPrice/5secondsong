import Image from "next/image";
import { createQuizData, getArtistInfo } from '@/lib/deezer'
import QuizContainer from "@/components/shared/QuizContainer";

const Quiz = async (props) => {
  const params = await props.params

  const artistInfo = await getArtistInfo(params.id)
  const quizData = await createQuizData(params.id)

  if (!artistInfo || !quizData) return (
    <div>Error fetching quiz information.</div>
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