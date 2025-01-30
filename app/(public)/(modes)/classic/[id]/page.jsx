import Image from "next/image";
import NotFound from "@/app/not-found";
import { createClassicQuizData, getArtistInfo } from "@/actions/deezer";
import QuizContainer from "@/components/shared/QuizContainer";
import NotEnoughTracks from "@/components/shared/NotEnoughTracks";
import { getPlaylistInfo } from "@/actions/spotify";

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
      quizData = await createClassicQuizData(sourceInfo.id, 'playlist');
    } else if (source === 'artist') {
      sourceInfo = await getArtistInfo(params.id);
      quizData = await createClassicQuizData(sourceInfo.id, 'artist');
    }

    return { sourceInfo, quizData };
  }

  const { sourceInfo, quizData } = await loadQuizData();

  if (quizData === 'Not enough tracks') {
    return <NotEnoughTracks />
  }

  if (!sourceInfo || !quizData) {
    return (
    <NotFound />
  )}

  return (
    <div className="container py-4 overflow-hidden">
      <QuizContainer
        artistDetails={sourceInfo}
        quizData={quizData}
        mode='classic'
        source={source}
      />
    </div>
  )
}

export default Quiz