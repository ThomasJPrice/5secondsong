'use client'

import Image from "next/image"
import { useState } from "react"
import { Button } from "../ui/button"
import { motion, AnimatePresence } from "framer-motion"
import MusicPlayer from "./MusicPlayer"

const QuizContainer = ({ artistDetails, quizData }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)

  const [score, setScore] = useState(0)

  function handleNextQuestion() {
    if (selectedAnswer && currentQuestionIndex < 9) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsPlaying(false)
      
      if (selectedAnswer.correct) {
        setScore(score + 1)
      }
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <Image className="h-[80px] w-[80px] aspect-square object-cover rounded-[0.5rem]" src={artistDetails.images[0].url} width={artistDetails.images[0].width} height={artistDetails.images[0].height} alt={`Image for ${artistDetails.name}`} />

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
            {/* music player placeholder */}
            <MusicPlayer
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              trackSrc={quizData[currentQuestionIndex].trackPreview}
              volume={volume}
              setVolume={setVolume}
            />

            {/* options */}
            <ul className="grid grid-cols-3 gap-4">
              {quizData[currentQuestionIndex].options.map((option, index) => (
                <li
                  key={option + index}
                  className="cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                  onClick={() => setSelectedAnswer(option)}
                >
                  <div className="relative">
                    <Image
                      priority
                      src={option.image}
                      width={200}
                      height={200}
                      className={`aspect-square transition-all ease-in duration-150 border-4 rounded-[0.5rem] object-cover ${selectedAnswer
                        ? (option.correct ? 'border-green-500' : 'border-red-500')
                        : 'border-transparent'
                        }`}
                      alt={`Cover image for ${option.name}`}
                    />
                    <p className="mt-2 text-center text-sm line-clamp-2">{option.name}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center">
        <Button disabled={!selectedAnswer} onClick={handleNextQuestion}>Next</Button>
      </div>
    </div>
  )
}

export default QuizContainer