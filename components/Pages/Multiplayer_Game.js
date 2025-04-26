import React, { Component } from "react";
import Pinyin from "../Components/Pinyin";
import Definition from "../Components/Definition";
import ExampleWords from "../Components/ExampleWords";
import Canvas from "../Components/Canvas";
import Guesses from "../Components/Guesses";
import Buttons from "../Components/Buttons";
import PlayerCard from "../Components/PlayerCard"
import MultiplayerCanvas from "../Components/MultiplayerCanvas";
import CharPreview from "../Components/CharPreview";
import Answers from "../Components/Answers";

class Multiplayer_Game extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.username = props.username;
    this.problems = props.problems;
    this.sessionId = props.sessionId;
    this.state = {
      sessionMap: props.sessionMap,
      prevAnswers: props.prevAnswers,
      round: props.round,
      strokes: [],
      showResults: false,
      isCorrectGuess: false
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.sessionMap !== this.props.sessionMap) {
      this.setState({
        sessionMap: this.props.sessionMap,
      });
    }
    if (prevProps.round !== this.props.round){
      this.setState({
        round: this.props.round,
      });
    }
    if (prevProps.prevAnswers !== this.props.prevAnswers){
      this.setState({
        prevAnswers: this.props.prevAnswers,
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
    this.props.voteNext()
  }

  guess = (char) => {
    const {round} = this.state;
    const elemInArray = this.problems[(round - 1)];
    const isCorrect = elemInArray.char.includes(char);

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
      this.props.correctGuess()
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
      prevAnswers,
    } = this.state;
    return (

      <div className="multiplayer-container">
        <div className="left-box">
          <div className="pinyin-definition-examplewords-container">
            <div className="pinyin-definition-container">
              <Pinyin pinyin={this.problems[round-1].pinyin} />
              <Definition definition={this.problems[round-1].definition} />
            </div>
            <div className="examplewords-container">
              <ExampleWords char={this.problems[round-1].char} words={this.problems[round-1].exampleWord} />
            </div>
          </div>

          <div className="outer-canvas-buttons-guesses-container">
            <div className="canvas-buttons-container">
              <Canvas ref={this.canvasRef} strokes={strokes} setStrokes={this.setStrokes} showResults={showResults} isCorrectGuess={isCorrectGuess} />
              <Buttons onUndo={this.undoButton} onClear={this.clearButton} onNext={this.nextButton} disableNextAfterClick={true} round={round}/>
              <PlayerCard player={sessionMap[this.sessionId]} />
            </div>
            <div className="guesses-container">
              <Guesses strokes={strokes} guess={this.guess} />
            </div>
            
          </div>
          <div className="answers-animate-container">
            <Answers prevAnswers={prevAnswers} onPrevChar={this.prevChar} />
            {/* <CharPreview showPreview={showPreview} onHide={this.hideButton} onAnimate={this.animateButton} char={charPreview} /> */}
          </div>
        </div>
        <div className="right-box">
          {Object.entries(sessionMap).map(([sessionId, playerMap]) => (
            sessionId !== this.sessionId && (
              <div key={sessionId}>
                <MultiplayerCanvas strokes={playerMap.strokes} />
                <PlayerCard player={playerMap} />
              </div>
            )
          ))}
        </div>
      </div>
    );
  }
}


export default Multiplayer_Game