import Image from "next/image";
import MusicPlayer from "./MusicPlayer";

export const ClassicQuestion = ({ quizData, currentQuestionIndex, selectedAnswer, setSelectedAnswer, isPlaying, setIsPlaying, volume, setVolume }) => (
  <div>
    <MusicPlayer
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      trackSrc={quizData[currentQuestionIndex].trackPreview}
      volume={volume}
      setVolume={setVolume}
      index={currentQuestionIndex}
    />
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
              src={option.image ? option.image : '/placeholder.jpg'}
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
  </div>
);
