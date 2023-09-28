import React, { Component } from "react";
import { DATA } from "../../src/data/wordBank";
import Pinyin from "../Components/Pinyin";
import Definition from "../Components/Definition";
import ExampleWords from "../Components/ExampleWords";
import Canvas from "../Components/Canvas";
import Guesses from "../Components/Guesses";
import Buttons from "../Components/Buttons";
import Score from "../Components/Score";
import Answers from "../Components/Answers";
import CharPreview from "../Components/CharPreview"
import HanziWriter from 'hanzi-writer';
import SettingsModal from "../Components/SettingsModal";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      difficulty: [0, 1000],
      problems: [DATA[0]],
      numCorrect: 0,
      numRounds: 1,
      strokes: [],
      isCorrectGuess: false,
      showResults: false,
      prevAnswers: [],
      showPreview: false,
      hanziWriter: null,
      charPreview: null,
    };

  }

  setStrokes = (newStrokes) => {
    this.setState({ strokes: newStrokes });
  };

  setDifficulty = (newDifficulty) => {
    this.setState({ 
      difficulty: newDifficulty,
    })
  }

  guess = (char) => {
    const { problems, numRounds } = this.state;
    
    const isCorrect = problems[numRounds - 1].char.includes(char);

    if (this.fadeTimeout) {
      clearTimeout(this.fadeTimeout);
    }

    this.setState({
      isCorrectGuess: isCorrect,
      showResults: true,
    });

    if (isCorrect) {
      this.setState((prevState) => ({
        numCorrect: prevState.numCorrect + 1,
        numRounds: prevState.numRounds + 1,
        strokes: [],
        prevAnswers: [...prevState.prevAnswers,{answer:problems[numRounds-1],correct:true}]
      }));
      this.clearButton()
    }

    this.fadeTimeout = setTimeout(() => {
      this.setState({
        showResults: false,
      });
    }, 500);

  };
  clearButton = () => {
    this.canvasRef.current.clearButton();
  };

  // Add a method to undo the last stroke
  undoButton = () => {
    this.canvasRef.current.undoButton();
  };

  nextButton =() => {
    const { problems, numRounds } = this.state;
    this.setState((prevState) => ({
      numRounds: prevState.numRounds + 1,
      strokes: [],
      prevAnswers: [...prevState.prevAnswers,{answer:problems[(numRounds-1)%problems.length],correct:false}]
    }));
    this.clearButton()
  }

  resetButton = () => {
    this.setState((prevState) => ({
      difficulty: prevState.difficulty,
      problems: this.shuffleArray(DATA.slice(prevState.difficulty[0], prevState.difficulty[1])),
      numCorrect: 0,
      numRounds: 1,
      strokes: [],
      isCorrectGuess: false,
      showResults: false,
      prevAnswers: [],
      showPreview: false
    }));
  }

  prevChar = (char, trad) => {
    let word = char.answer.char.charAt(0);
    if (trad) {
      word = trad;
      
    }
    this.setState(() => ({
      showPreview: true,
      charPreview: char
    }));
    this.state.hanziWriter.setCharacter(word)

  };

  hideButton =() => {
    this.setState(() => ({
      showPreview: false
    }));
  }


  animateButton = () => {
    this.state.hanziWriter.animateCharacter()
  }
  shuffleArray(array) {
    const slicedArray = [...array];
  
    for (let i = slicedArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [slicedArray[i], slicedArray[j]] = [slicedArray[j], slicedArray[i]];
    }
  
    return slicedArray;
  }

  componentDidMount() {
    const options = {
      width: 100,
      height: 100,
      padding: 5,
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 200,
      showOutline: true,
    }

    this.setState(
      {
        problems: this.shuffleArray(DATA.slice(this.state.difficulty[0], this.state.difficulty[1])),
        hanziWriter: new HanziWriter('char-preview',options)
      },() => {
        // Load Google Tag Manager after the component is mounted
        this.loadGoogleTagManager();
      }
    )

    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
      button.addEventListener("touchstart", this.handleTouchStart);
      button.addEventListener("touchend", this.handleTouchEnd);
    });



  }

  handleTouchStart = (event) => {
    event.target.classList.add("touch-active");
  };

  handleTouchEnd = (event) => {
    event.target.classList.remove("touch-active");
  };

  loadGoogleTagManager() {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      // Create the script element for gtag.js
      const script = document.createElement("script");
      script.async = true;
      script.src =
        "https://www.googletagmanager.com/gtag/js?id=G-3WZGC6L37P";

      // Append the script element to the document's head
      document.head.appendChild(script);

      // Add an event listener to initialize Google Tag Manager when the script is loaded
      script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          window.dataLayer.push(arguments);
        }
        gtag("js", new Date());
        gtag("config", "G-3WZGC6L37P");
      };
    }
  }


  render() {
    const {
      problems,
      numRounds,
      strokes,
      difficulty,
      numCorrect,
      isCorrectGuess,
      showResults,
      prevAnswers,    
      showPreview,
      charPreview,
    } = this.state;

    return (
      <div>
        <h1>Chinese Character Recognition</h1>
        <div className="pinyin-definition-examplewords-container">
          <div className="pinyin-definition-container">
            <Pinyin pinyin={problems[(numRounds - 1) % this.state.problems.length].pinyin} />
            <Definition definition={problems[(numRounds - 1) % this.state.problems.length].definition} />
          </div>
          <div className="examplewords-container">
            <ExampleWords char={problems[(numRounds-1) % this.state.problems.length].char} words={problems[(numRounds - 1) % this.state.problems.length].exampleWord} />
          </div>
        </div>
        
        <div className="outer-canvas-buttons-guesses-container">
          <div className="canvas-buttons-container">
            <Canvas ref={this.canvasRef} strokes={strokes} setStrokes={this.setStrokes} showResults={showResults} isCorrectGuess={isCorrectGuess}/>
            <Buttons onUndo={this.undoButton} onClear={this.clearButton} onNext={this.nextButton} />
          </div>
          <div className="guesses-container">
            <Guesses strokes={strokes} guess={this.guess} />
          </div> 
        </div>
        <div className="answers-animate-container">
          <Answers prevAnswers={prevAnswers} onPrevChar={this.prevChar} />
          <CharPreview showPreview={showPreview} onHide={this.hideButton} onAnimate={this.animateButton} char={charPreview}/>
        </div>
        
        <Score numCorrect={numCorrect} numRounds={numRounds} />
        <SettingsModal setDifficulty={this.setDifficulty} difficulty={this.state.difficulty} onReset={this.resetButton}/>
      </div>
    );
  }
}

export default HomePage;