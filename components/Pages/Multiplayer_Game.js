import React, { Component } from "react";
import Canvas from "../Components/Canvas";
import Guesses from "../Components/Guesses";
import MultiplayerCanvas from "../Components/MultiplayerCanvas";
import Answers from "../Components/Answers";
import ExampleWords from "../Components/ExampleWords";
import CharPreview from "../Components/CharPreview";
import HanziWriter from 'hanzi-writer';

class Multiplayer_Game extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.charPreviewRef = React.createRef();
    this.username = props.username;
    this.problems = props.problems;
    this.sessionId = props.sessionId;
    this.totalRounds = props.problems?.length || 10;
    this.state = {
      sessionMap: props.sessionMap,
      prevAnswers: props.prevAnswers,
      round: props.round,
      strokes: [],
      showResults: false,
      isCorrectGuess: false,
      skipVotes: props.skipVotes || { skipped: 0, total: 0 },
      showPreview: false,
      charPreview: null
    }
  }
  componentDidMount() {
    const charPreviewEl = document.getElementById('char-preview');
    if (charPreviewEl && typeof HanziWriter !== 'undefined') {
      const writer = HanziWriter.create('char-preview', '中', {
        width: 100,
        height: 100,
        padding: 5,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 200,
        showOutline: true,
      });
      window.hanziWriterInstance = writer;
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
    if (prevProps.skipVotes !== this.props.skipVotes){
      this.setState({
        skipVotes: this.props.skipVotes,
      });
    }
    if (prevProps.prevAnswers !== this.props.prevAnswers){
      this.setState({
        prevAnswers: this.props.prevAnswers,
      });
    }
    if (prevProps.round !== this.props.round){
      this.setState({
        round: this.props.round,
      }, () => {
        this.clearButton();
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

  prevChar = (char, trad) => {
    let word = char.answer.char.charAt(0);
    if (trad) {
      word = trad;
    }
    this.setState({ showPreview: true, charPreview: char });
    if (window.hanziWriterInstance) {
      window.hanziWriterInstance.setCharacter(word);
    }
  };

  hideButton = () => {
    this.setState({ showPreview: false });
  };

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
      skipVotes,
      showPreview,
      charPreview
    } = this.state;
    const currentProblem = this.problems[round-1];
    
    const otherPlayers = Object.entries(sessionMap)
      .filter(([sessionId]) => sessionId !== this.sessionId)
      .map(([sessionId, playerMap]) => ({ sessionId, ...playerMap }));
    if (!currentProblem || !sessionMap) {
      return "Loading...";
    }
    return (
      <div className="multiplayer-container">
        <header className="header">
          <h1>Multiplayer Race</h1>
          <p>Race to draw the correct character first!</p>
        </header>

        <div className="score-bar">
          <div className="score-item">
            <span className="label">Round</span>
            <span className="value">{round}/{this.totalRounds}</span>
          </div>
          <div className="score-divider"></div>
          <div className="player-score">
            <div className="lobby-player-color" style={{ backgroundColor: sessionMap[this.sessionId]?.colour }}></div>
            <span className="name">You</span>
            <span className="score">{sessionMap[this.sessionId]?.score || 0}</span>
          </div>
          {otherPlayers.map((player) => (
            <div key={player.sessionId} className="player-score">
              <div className="lobby-player-color" style={{ backgroundColor: player.colour }}></div>
              <span className="name">{player.username}</span>
              <span className="score">{player.score || 0}</span>
            </div>
          ))}
        </div>

        <div className="hint-card">
          <span className="hint-label">Character Hints</span>
          <div className="hint-content">
            <div className="hint-item">
              <div className="label">Pinyin</div>
              <div className="pinyin">{currentProblem.pinyin}</div>
            </div>
            <div className="hint-item">
              <div className="label">Definition</div>
              <div className="definition">{currentProblem.definition}</div>
            </div>
            <div className="example-words">
              <div className="label">Example Words</div>
              <div className="example-word-list">
                <ExampleWords char={currentProblem.char} words={currentProblem.exampleWord} />
              </div>
            </div>
          </div>
        </div>

        <div className="guesses-section">
          <div className="guesses-header">
            <span className="guesses-title">Recognized</span>
            <span className="guesses-hint">Tap to guess</span>
          </div>
          <Guesses strokes={strokes} guess={this.guess} singleRow={true} />
        </div>

        <div className="all-canvases-container">
          <div className="canvas-section your-canvas">
            <div className="canvas-header">
              <div className="lobby-player-color" style={{ backgroundColor: sessionMap[this.sessionId]?.colour }}></div>
              <span className="name">You</span>
              <div className="canvas-actions">
                <button className="canvas-btn" title="Undo" onClick={this.undoButton}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 10h10a5 5 0 0 1 5 5v2M3 10l5-5M3 10l5 5"/>
                  </svg>
                </button>
                <button className="canvas-btn" title="Clear" onClick={this.clearButton}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="canvas-wrapper">
              <Canvas 
                ref={this.canvasRef} 
                strokes={strokes} 
                setStrokes={this.setStrokes} 
                showResults={showResults} 
                isCorrectGuess={isCorrectGuess} 
              />
              <div className="canvas-hint">Draw strokes here</div>
            </div>
          </div>

          {otherPlayers.map((player) => (
            <div key={player.sessionId} className="canvas-section opponent-canvas">
              <div className="canvas-header">
                <span className="canvas-title">
                  <div className="lobby-player-color" style={{ backgroundColor: player.colour }}></div>
                  <span className="name">{player.username}</span>
                </span>
              </div>
              <div className="canvas-wrapper">
                <MultiplayerCanvas strokes={player.strokes || []} />
              </div>
            </div>
          ))}
        </div>

        <button className="multiplayer-skip-btn" onClick={this.nextButton}>
          Skip {skipVotes.total > 0 ? `(${skipVotes.skipped}/${skipVotes.total})` : ''}
        </button>  

        <div className="history-section">
          <div className="history-header">
            <span className="history-title">Recent Answers</span>
          </div>
          <div className="history-list">
            <Answers prevAnswers={prevAnswers} onPrevChar={this.prevChar} sessionMap={sessionMap} />
          </div>
        </div>

        <CharPreview ref={this.charPreviewRef} showPreview={showPreview} char={charPreview} onHide={this.hideButton} />
        
        <div id="char-preview" style={{ display: 'none' }}></div>
      </div>
    );
  }
}


export default Multiplayer_Game