'use server'

const BASEURL = 'https://api.deezer.com'

export async function createClassicQuizData(id) {
  try {
    const topTracks = await fetch(`${BASEURL}/artist/${id}/top?limit=100`)
      .then((response) => response.json())
      .then((data) => data.data)

    if (!topTracks || topTracks.length < 10) {
      return 'Not enough tracks'
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
      return 'Not enough tracks'
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

export async function queryArtists(query, options = {}) {
  try {
    const response = await fetch(`https://api.deezer.com/search/artist?q=${query}`, options);

    if (!response.ok) {
      throw new Error("Failed to fetch artists");
    }

    const data = await response.json();
    return data.data; // Assuming the API response contains an array of artists in `data`
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Fetch request cancelled");
    } else {
      console.error("Error fetching artists:", error);
    }
    return [];
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

  // Step 1: Randomly select a stanza
  const randomStanzaIndex = Math.floor(Math.random() * stanzas.length);
  const chosenStanza = stanzas[randomStanzaIndex];
  const lines = chosenStanza.split('\n');

  // Step 2: Ensure we have exactly 4 lines
  let selectedLines;
  if (lines.length > 4) {
    // If more than 4 lines, randomly pick a 4-line slice
    const startIndex = Math.floor(Math.random() * (lines.length - 3));
    selectedLines = lines.slice(startIndex, startIndex + 4);
  } else {
    // If fewer than 4 lines, add extra lines from other stanzas
    selectedLines = [...lines];
    while (selectedLines.length < 4) {
      const extraLine = stanzas[Math.floor(Math.random() * stanzas.length)].split('\n');
      selectedLines.push(extraLine[Math.floor(Math.random() * extraLine.length)]);
    }
  }

  // Step 3: Flatten lines into words and pick a random word to remove
  const words = [];
  const lineBreaks = [];
  selectedLines.forEach((line, lineIndex) => {
    line.split(/\s+/).forEach((word) => words.push(word));
    if (lineIndex < selectedLines.length - 1) {
      lineBreaks.push(words.length);
    }
  });

  const randomWordIndex = Math.floor(Math.random() * words.length);
  const removedWord = words[randomWordIndex];
  words[randomWordIndex] = '_'.repeat(removedWord.length);

  // Step 4: Rebuild the stanza with missing word
  const updatedStanza = lineBreaks.reduce(
    (acc, breakIndex) => {
      acc.lines.push(words.slice(acc.start, breakIndex).join(' '));
      acc.start = breakIndex;
      return acc;
    },
    { lines: [], start: 0 }
  );
  updatedStanza.lines.push(words.slice(updatedStanza.start).join(' '));

  return {
    updatedStanza: updatedStanza.lines.join('\n'),
    removedWord,
    originalStanza: chosenStanza,
  };
}
