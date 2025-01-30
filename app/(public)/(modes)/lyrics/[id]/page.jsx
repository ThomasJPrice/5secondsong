import Image from "next/image";
import QuizContainer from "@/components/shared/QuizContainer";
import NotFound from "@/app/not-found";
import { getArtistInfo, createLyricsQuizData } from "@/actions/deezer";
import { getPlaylistInfo } from "@/actions/spotify";

export async function generateMetadata(props) {
  const params = await props.params

  const artistInfo = await getArtistInfo(params.id)

  return {
    title: `${artistInfo.name} | 5 Second Song`,
    description: `Can you guess 10 of ${artistInfo.name}'s songs within 5 seconds of hearing each one?`
  }
}

const LyricsQuiz = async (props) => {
  const params = await props.params
  const searchParams = await props.searchParams

  const source = searchParams ? searchParams.source : null

  if (!source) {
    return <NotFound />
  }

  async function loadQuizData() {
    let sourceInfo;
    let quizData;

    if (source === 'playlist') {
      sourceInfo = await getPlaylistInfo(params.id);
      quizData = await createLyricsQuizData(sourceInfo.id, 'playlist');
    } else if (source === 'artist') {
      sourceInfo = await getArtistInfo(params.id);
      quizData = await createLyricsQuizData(sourceInfo.id, 'artist');
    }

    return { sourceInfo, quizData };
  }

  const { sourceInfo, quizData } = await loadQuizData();

  if (!sourceInfo || !quizData) return (
    <NotFound />
  )

  return (
    <div className="container py-4 overflow-hidden">
      <QuizContainer
        artistDetails={sourceInfo}
        quizData={quizData}
        mode='lyrics'
      />
    </div>
  )
}

export default LyricsQuiz