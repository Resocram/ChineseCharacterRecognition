import React, { Component } from "react";
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

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      difficulty: 1,
      problems: [DATA[0]],
      numCorrect: 0,
      numRounds: 1,
      strokes: [],
    };

  }

  setStrokes = (newStrokes) => {
    this.setState({ strokes: newStrokes });
  };

  clearCanvas = () => {
    this.canvasRef.current.clearButton();
  };

  // Add a method to undo the last stroke
  undoStroke = () => {
    this.canvasRef.current.undoButton();
  };

  shuffleArray(array) {
    const slicedArray = [...array];
  
    // Shuffle the sliced array
    for (let i = slicedArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [slicedArray[i], slicedArray[j]] = [slicedArray[j], slicedArray[i]];
    }
  
    return slicedArray;
  }

  componentDidMount() {
    // Fetch matches initially
    this.setState(
      {
        problems: this.shuffleArray(DATA.slice(0,this.state.difficulty))
      }
    )
}

  render() {
    const {
      problems,
      numRounds,
      strokes,
      difficulty,
      numCorrect,
    } = this.state;

    return (
      <div>
        <h1>Chinese Character Recognition</h1>
        <div className="pinyin-definition-container">
          <Pinyin pinyin={problems[numRounds - 1].pinyin} />
          <div className="definition">
            <Definition definition={problems[numRounds - 1].definition} />
          </div>
        </div>
        <ExampleWords char={problems[numRounds-1].char} words={problems[numRounds - 1].exampleWord} />
        <div className="outer-canvas-buttons-guesses-container">
          <div className="canvas-buttons-container">
            <Canvas ref={this.canvasRef} strokes={strokes} setStrokes={this.setStrokes} />
            <Buttons onUndo={this.undoStroke} onClear={this.clearCanvas} />
          </div>
          <div>
            <Guesses strokes={strokes} />
          </div>
        </div>
        <Answers />
        <Score numCorrect={numCorrect} numRounds={numRounds} />
        <DifficultySetter />
      </div>
    );
  }
}

export default HomePage;