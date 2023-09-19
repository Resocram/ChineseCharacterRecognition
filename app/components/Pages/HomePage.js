import { useState, useRef } from "react"; // Import useRef
import { DATA } from "../../src/data/wordBank";
import Pinyin from "../Components/Pinyin";
import Definition from "../Components/Definition";
import ExampleWords from "../Components/ExampleWords";
import Canvas from "../Components/Canvas";
import Guesses from "../Components/Guesses";
import Buttons from "../Components/Buttons";
import Score from "../Components/Score";
import DifficultySetter from "../Components/DifficultySetter";
import Answers from "../Components/Answers";

export default function HomePage() {
  const [problem, setProblem] = useState(DATA[1]);
  const [numCorrect, setNumCorrect] = useState(0);
  const [numRounds, setNumRounds] = useState(0);

  // Define canvasRef using useRef
  const canvasRef = useRef(null);

  const handleUndo = () => {
    // Call undoLastStroke function from Canvas component
    // You can access the Canvas component instance using a ref
    canvasRef.current.undoButton();
  };

  const handleClear = () => {
    // Call clearCanvas function from Canvas component
    // You can access the Canvas component instance using a ref
    canvasRef.current.clearButton();
  };

  return (
    <div>
      Chinese Character Recognition
      <Pinyin pinyin={problem.pinyin} />
      <Definition definition={problem.definition} />
      <ExampleWords words={problem.exampleWord} />
      {/* Pass canvasRef as a ref to the Canvas component */}
      <Canvas ref={canvasRef} />
      <Buttons onUndo={handleUndo} onClear={handleClear} />
      <Guesses strokes={canvasRef.current?.getStrokesArray()} />
      <Answers />
      <Score numCorrect={numCorrect} numRounds={numRounds} />
      <DifficultySetter />
    </div>
  );
}





