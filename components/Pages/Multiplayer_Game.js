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
    this.ws = props.ws;
    this.username = props.username;
    this.characters = props.characters;
    this.state = {
      strokeMap: props.strokeMap,
      players: props.players,
      round: 1,
      strokes: [],
      showResults: false,
      isCorrectGuess: false,

    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.strokeMap !== this.props.strokeMap) {
      this.setState({
        strokeMap: this.props.strokeMap,
      });
    }
  }
  setStrokes = (newStrokes) => {
    this.setState({ strokes: newStrokes }, () => {
      this.sendStrokes();
    });
  };

  sendStrokes = () => {
    const sendStrokes = {
      type: 'send_strokes',
      username: this.username,
      strokes: this.state.strokes
    };
    this.ws.send(JSON.stringify(sendStrokes));
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

    const isCorrect = this.characters[round - 1].char.includes(char);

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
      players,
      strokeMap,
    } = this.state;
    return (

      <div className="multiplayer-container">
        <div className="left-box" style={{ border: '2px solid green' }}>
          <div className="pinyin-definition-examplewords-container" style={{ border: '2px solid red' }}>
            <div className="pinyin-definition-container">
              <Pinyin pinyin={this.characters[round - 1].pinyin} />
              <Definition definition={this.characters[round - 1].definition} />
            </div>
            <div className="examplewords-container">
              <ExampleWords char={this.characters[round - 1].char} words={this.characters[round - 1].exampleWord} />
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
          {players.map((player) => (
            player !== this.username && (
              <div key={player}>
                <MultiplayerCanvas strokes={strokeMap[player]} />
                <div>Player: {player}</div>
              </div>
            )
          ))}

        </div>
      </div>
    );
  }
}


export default Multiplayer_Game