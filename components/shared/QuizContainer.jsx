'use client'

import Image from "next/image"
import { useState } from "react"
import { Button } from "../ui/button"
import { motion, AnimatePresence } from "framer-motion"
import MusicPlayer from "./MusicPlayer"
import { LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { handleQuizSubmit } from "@/actions/quiz"
import { ClassicQuestion } from "./ClassicQuestion"
import { LyricsQuestion } from "./LyricsQuestion"

function validateQuizSubmission({ score, time, deezerId, selectedAnswer }) {
  if (score > 10 || score < 0) {
    return { valid: false, message: "Score must be between 0 and 10." };
  }

  if (time < 0 || time > 3600000) {
    return { valid: false, message: "Time must be between 0 and 3600000 ms." };
  }

  if (!deezerId) {
    return { valid: false, message: "Deezer ID is required." };
  }

  if (!selectedAnswer) {
    return { valid: false, message: "Selected answer is required." };
  }

  return { valid: true, message: "Validation successful." };
}


const QuizContainer = ({ artistDetails, quizData, mode }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // for classic mode
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  // for lyrics mode
  const [userInput, setUserInput] = useState('')

  const [score, setScore] = useState(0)

  const [isLoading, setIsLoading] = useState(false)

  const [startTime, setStartTime] = useState(Date.now())

  const router = useRouter()

  function handleNextQuestion() {
    if (currentQuestionIndex === 9) {
      handleSubmit()
      return
    }

    if (mode === "classic") {
      if (selectedAnswer && currentQuestionIndex < 9) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsPlaying(false);

        if (selectedAnswer.correct) {
          setScore(score + 1);
        }
      }
    } else if (mode === "lyrics") {
      if (userInput && currentQuestionIndex < 9) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserInput("");

        if (userInput.trim().toLowerCase() === quizData[currentQuestionIndex].removedWord.toLowerCase()) {
          setScore(score + 1);
        }
      }
    }
  }

  async function handleSubmit() {
    setIsLoading(true)

    const time = Date.now() - startTime

    const validation = validateQuizSubmission({
      score: score,
      time: time,
      deezerId: artistDetails.id,
      selectedAnswer: mode === "classic" ? selectedAnswer : userInput
    })

    if (!validation.valid) {
      console.error(validation.message)
      return
    }

    var finalScore = 0
    if (mode === "classic") {
      finalScore = selectedAnswer.correct ? score + 1 : score
    } else if (mode === "lyrics") {
      finalScore = userInput.trim().toLowerCase() === quizData[currentQuestionIndex].removedWord.toLowerCase() ? score + 1 : score
    }

    const id = await handleQuizSubmit({
      deezer_artist_id: artistDetails.id,
      artist_details: {
        name: artistDetails.name,
        image: artistDetails.picture_big
      },
      score: finalScore,
      time: time,
      mode: mode
    })

    setIsLoading(false)
    router.replace(`/result/${id}`)
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <Image className="h-[80px] w-[80px] aspect-square object-cover rounded-[0.5rem]" src={artistDetails.picture_medium ? artistDetails.picture_medium : '/placeholder.jpg'} width={400} height={400} alt={`Image for ${artistDetails.name}`} />

        <div>
          <h2 className="text-2xl font-primary text-primary">{artistDetails.name}</h2>
          <p>Question {currentQuestionIndex + 1} of 10</p>
        </div>
      </div>

      <div className="max-w-[500px] mx-auto py-4 my-8 relative w-full">
        {/* questions go here */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            {mode === 'classic' ? (
              <ClassicQuestion
                quizData={quizData}
                currentQuestionIndex={currentQuestionIndex}
                selectedAnswer={selectedAnswer}
                setSelectedAnswer={setSelectedAnswer}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                volume={volume}
                setVolume={setVolume}
              />
            ) : mode === 'lyrics' ? (
              <LyricsQuestion
                quizData={quizData}
                currentQuestionIndex={currentQuestionIndex}
                userInput={userInput}
                setUserInput={setUserInput}
                handleSubmit={handleNextQuestion}
              />
            ) : (
              <div>Unrecognised mode.</div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center">
        {currentQuestionIndex !== 9 ? (
          <Button disabled={!selectedAnswer && !userInput} onClick={handleNextQuestion}>
            Next
          </Button>
        ) : (
          <Button disabled={!selectedAnswer && !userInput} onClick={handleSubmit}>
            {isLoading ? <LoaderCircle className="animate-spin" /> : 'Submit'}
          </Button>
        )}
      </div>
    </div>
  )
}

export default QuizContainer