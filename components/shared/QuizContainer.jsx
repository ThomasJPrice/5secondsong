import Image from "next/image"

const QuizContainer = ({ artistDetails, quizData }) => {
  return (
    <div>
      <div className="flex items-center gap-4">
        <Image className="h-[80px] w-[80px] aspect-square object-cover rounded-[0.5rem]" src={artistDetails.images[0].url} width={artistDetails.images[0].width} height={artistDetails.images[0].height} alt={`Image for ${artistDetails.name}`} />

        <div>
          <h2 className="text-2xl font-primary text-primary">{artistDetails.name}</h2>
          <p>Question 1 of 10</p>
        </div>
      </div>
    </div>
  )
}

export default QuizContainer