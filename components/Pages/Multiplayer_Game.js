import React, { Component } from "react";
import Pinyin from "../Components/Pinyin";
import Definition from "../Components/Definition";
import ExampleWords from "../Components/ExampleWords";
import Canvas from "../Components/Canvas";
import Guesses from "../Components/Guesses";
import Buttons from "../Components/Buttons";
import MultiplayerCanvas from "../Components/MultiplayerCanvas";

class Multiplayer_Game extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.username = props.username;
    this.characters = props.characters;
    this.sessionId = props.sessionId;
    this.state = {
      sessionMap: props.sessionMap,
      round: props.round,
      strokes: [],
      showResults: false,
      isCorrectGuess: false,

    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.sessionMap !== this.props.sessionMap) {
      this.setState({
        sessionMap: this.props.sessionMap,
      });
    }
  }
  setStrokes = (newStrokes) => {
    this.setState({ strokes: newStrokes }, () => {
      this.props.sendStrokes(newStrokes);
    });
  };



  clearButton = () => {
    this.canvasRef.current.clearButton();
  };

  undoButton = () => {
    this.canvasRef.current.undoButton();
  };

  nextButton = () => {
    // Add voting next button if no one can get it
    this.clearButton()
  }

  guess = (char) => {
    const { round } = this.state;

    const isCorrect = this.characters[round].char.includes(char);

    if (this.fadeTimeout) {
      clearTimeout(this.fadeTimeout);
    }

    this.setState({
      isCorrectGuess: isCorrect,
      showResults: true,
    });

    if (isCorrect) {
      this.setState((prevState) => ({
        strokes: [],
      }));
      this.clearButton()
    }

    this.fadeTimeout = setTimeout(() => {
      this.setState({
        showResults: false,
      });
    }, 500);

  };


  render() {
    const {
      round,
      strokes,
      isCorrectGuess,
      showResults,
      sessionMap,
    } = this.state;
    console.log(sessionMap)
    return (

      <div className="multiplayer-container">
        <div className="left-box" style={{ border: '2px solid green' }}>
          <div className="pinyin-definition-examplewords-container" style={{ border: '2px solid red' }}>
            <div className="pinyin-definition-container">
              <Pinyin pinyin={this.characters[round].pinyin} />
              <Definition definition={this.characters[round].definition} />
            </div>
            <div className="examplewords-container">
              <ExampleWords char={this.characters[round].char} words={this.characters[round].exampleWord} />
            </div>
          </div>

          <div className="outer-canvas-buttons-guesses-container" style={{ border: '2px solid red' }}>
            <div className="canvas-buttons-container">
              <Canvas ref={this.canvasRef} strokes={strokes} setStrokes={this.setStrokes} showResults={showResults} isCorrectGuess={isCorrectGuess} />
              <Buttons onUndo={this.undoButton} onClear={this.clearButton} onNext={this.nextButton} />
            </div>
            <div className="guesses-container">
              <Guesses strokes={strokes} guess={this.guess} />
            </div>
          </div>
        </div>
        <div className="right-box" style={{ border: '2px solid green' }}>
          {Object.entries(sessionMap).map(([sessionId, playerMap]) => (
            sessionId !== this.sessionId && (
              <div key={sessionId}>
                <MultiplayerCanvas strokes={playerMap.strokes} />
                <div>Player: {playerMap.username}</div>
              </div>
            )
          ))}
        </div>
      </div>
    );
  }
}


export default Multiplayer_Game