'use client'

import { useRef, useEffect } from "react";
import { Input } from "../ui/input";

export const LyricsQuestion = ({ quizData, currentQuestionIndex, userInput, setUserInput, handleSubmit }) => {
  const { updatedStanza, removedWord } = quizData[currentQuestionIndex];
  
  // Create a ref for the input field
  const inputRef = useRef(null);

  // Focus the input when the component mounts or when the question changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentQuestionIndex]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="md:w-max">
        <h2 className="text-center text-xl font-primary text-primary">{quizData[currentQuestionIndex].title}</h2>

        <div className="h-[1px] w-1/2 mt-1 bg-primary mx-auto" />
      </div>

      <div className="text-lg text-center">
        {updatedStanza.split('\n').map((line, index) => (
          <p key={index} className="mb-2">
            {line}
          </p>
        ))}
      </div>

      <Input
        type="text"
        ref={inputRef} // Attach the ref to the input field
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
        className="w-full max-w-[300px] text-center px-4 py-2 border rounded-md"
        placeholder="Type the missing word..."
      />
    </div>
  );
};
