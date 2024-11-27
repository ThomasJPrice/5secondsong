import { getArtistInfo } from "./spotify";

export async function getDeezerId(id) {
  const artist = await getArtistInfo(id)
  const name = artist.name

  const response = await fetch(`https://api.deezer.com/search/artist?q=artist:"${name}"&limit=1&strict=on`)

  const data = await response.json()

  if (!data) return {}

  return data.data[0].id

}

export async function createQuizData(id) {
  const deezerId = await getDeezerId(id)

  const topTracks = await fetch(`https://api.deezer.com/artist/${deezerId}/top?limit=100`)
    .then((response) => response.json())
    .then((data) => data.data)

  if (!topTracks || topTracks.length < 10) {
    throw new Error('Not enough tracks available to create a quiz');
  }

  const shuffledTracks = topTracks.sort(() => Math.random() - 0.5);

  const quizTracks = shuffledTracks.slice(0, 10);

  const quizData = quizTracks.map((track, index) => {
    const falseOptions = shuffledTracks
      .filter((t) => t.id !== track.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    const options = [
      {
        image: track.album.cover_big,
        name: track.title,
        correct: true,
      },
      ...falseOptions.map((falseTrack) => ({
        image: falseTrack.album.cover_big,
        name: falseTrack.title,
        correct: false,
      })),
    ].sort(() => Math.random() - 0.5);

    return {
      questionNumber: index + 1,
      trackPreview: track.preview,
      options,
    };
  });

  return quizData;
}