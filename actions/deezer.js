'use server'

const BASEURL = 'https://api.deezer.com'

export async function createClassicQuizData(id) {
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

export async function createLyricsQuizData(id) {
  try {
    const topTracks = await fetch(`${BASEURL}/artist/${id}/top?limit=100`)
      .then((response) => response.json())
      .then((data) => data.data)

    if (!topTracks || topTracks.length < 10) {
      throw new Error('Not enough tracks available to create a quiz');
    }

    const shuffledTracks = topTracks.sort(() => Math.random() - 0.5);

    // const quizTracks = shuffledTracks.slice(0, 10);

    var quizData = []
    while (quizData.length < 10) {
      const track = shuffledTracks.pop()
      
      if (!track) {
        break
      }
      
      const lyrics = await fetchLyrics(track.title, track.artist.name, track.album.title, track.duration)

      if (lyrics?.plainLyrics) {

        // handle lyrics
        const { updatedStanza, removedWord, originalStanza } = processLyrics(lyrics.plainLyrics);

        quizData.push({
          questionNumber: quizData.length + 1,
          updatedStanza: updatedStanza,
          removedWord: removedWord,
          originalStanza: originalStanza,
          title: track.title,
          artist: track.artist.name,
          album: track.album.title,
          image: track.album.cover_big,
        });
      }
    }

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

export async function fetchLyrics(title, artist, album, duration) {
  try {
    const response = await fetch(`https://lrclib.net/api/get?artist_name=${artist}&track_name=${title}&album_name=${album}&duration=${duration}`)

    const data = await response.json()

    if (data) {
      return data
    } else {
      throw new Error('No lyrics found')
    }
  } catch (error) {
    console.error('Error fetching lyrics', title, artist)
  }
}

function processLyrics(plainLyrics) {
  const stanzas = plainLyrics.split('\n\n');

  const randomStanzaIndex = Math.floor(Math.random() * stanzas.length);
  const chosenStanza = stanzas[randomStanzaIndex];

  const lines = chosenStanza.split('\n');

  const words = [];
  const lineBreaks = [];
  lines.forEach((line, lineIndex) => {
    line.split(/\s+/).forEach((word) => words.push(word));
    if (lineIndex < lines.length - 1) {
      lineBreaks.push(words.length); // Track the end of each line
    }
  });

  const randomWordIndex = Math.floor(Math.random() * words.length);
  const removedWord = words[randomWordIndex];

  words[randomWordIndex] = '_'.repeat(removedWord.length);

  const updatedStanza = lineBreaks.reduce(
    (acc, breakIndex) => {
      acc.lines.push(words.slice(acc.start, breakIndex).join(' '));
      acc.start = breakIndex;
      return acc;
    },
    { lines: [], start: 0 }
  );
  updatedStanza.lines.push(words.slice(updatedStanza.start).join(' ')); // Add the last line

  return {
    updatedStanza: updatedStanza.lines.join('\n'), // Stanza with the missing word
    removedWord, // The removed word
    originalStanza: chosenStanza, // Original stanza for reference
  };
}