'use server'

const BASEURL = 'https://api.deezer.com'

export async function createQuizData(id) {
  try {
    const topTracks = await fetch(`${BASEURL}/artist/${id}/top?limit=100`)
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
  } catch (error) {
    console.error(error)
  }
}

export async function queryArtists(query) {
  try {
    const response = await fetch(`${BASEURL}/search/artist?q="${query}"&limit=10`)

    const data = await response.json()

    if (data) {
      return data.data
    }    
    
  } catch (error) {
    console.error('Error querying Deezer artists', query)
  }
}

export async function getArtistInfo(id) {
  try {
    const response = await fetch(`${BASEURL}/artist/${id}`)

    const data = await response.json()

    if (data) {
      return data
    } else {
      throw new Error('No artist details')
    }

  } catch (error) {
    console.error('Error getting artist details', query)
  }
} 