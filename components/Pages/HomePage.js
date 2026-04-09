import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import DATA from "../../wordBank.json";
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

function shuffleArray(array) {
  const slicedArray = [...array];
  for (let i = slicedArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slicedArray[i], slicedArray[j]] = [slicedArray[j], slicedArray[i]];
  }
  return slicedArray;
}

export default function HomePage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const charPreviewRef = useRef(null);
  
  const [difficulty, setDifficulty] = useState([0, 1000]);
  const [problems, setProblems] = useState([DATA[0]]);
  const [numCorrect, setNumCorrect] = useState(0);
  const [numRounds, setNumRounds] = useState(1);
  const [strokes, setStrokes] = useState([]);
  const [isCorrectGuess, setIsCorrectGuess] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [prevAnswers, setPrevAnswers] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [charPreview, setCharPreview] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const fadeTimeoutRef = useRef(null);

  const clearButton = () => {
    canvasRef.current?.clearButton();
  };

  const undoButton = () => {
    canvasRef.current?.undoButton();
  };

  const setStrokesState = (newStrokes) => {
    setStrokes(newStrokes);
  };

  const setDifficultyState = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  const applyDifficulty = () => {
    setProblems(shuffleArray(DATA.slice(difficulty[0], difficulty[1])));
    setNumCorrect(0);
    setNumRounds(1);
    setStrokes([]);
    setPrevAnswers([]);
    clearButton();
  };

  const navigateToMultiplayer = () => {
    navigate('/room');
  };

  const guess = (char) => {
    const currentProblem = problems[(numRounds - 1) % problems.length];
    const isCorrect = currentProblem.char.includes(char);

    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }

    setIsCorrectGuess(isCorrect);
    setShowResults(true);

    if (isCorrect) {
      setNumCorrect(prev => prev + 1);
      setNumRounds(prev => prev + 1);
      setStrokes([]);
      setCurrentStreak(prev => prev + 1);
      setPrevAnswers(prev => [...prev, { answer: currentProblem, colour: "green" }]);
      clearButton();
    } else {
      setCurrentStreak(0);
    }

    fadeTimeoutRef.current = setTimeout(() => {
      setShowResults(false);
    }, 500);
  };

  const skipButton = () => {
    const currentProblem = problems[(numRounds - 1) % problems.length];
    setNumRounds(prev => prev + 1);
    setStrokes([]);
    setCurrentStreak(0);
    setPrevAnswers(prev => [...prev, { answer: currentProblem, colour: "red" }]);
    clearButton();
  };

  const resetButton = () => {
    setDifficulty([0, 1000]);
    setProblems(shuffleArray(DATA.slice(0, 1000)));
    setNumCorrect(0);
    setNumRounds(1);
    setStrokes([]);
    setIsCorrectGuess(false);
    setShowResults(false);
    setPrevAnswers([]);
    setShowPreview(false);
    setCurrentStreak(0);
  };

  const prevChar = (char, trad) => {
    let word = char.answer.char.charAt(0);
    if (trad) {
      word = trad;
    }
    setShowPreview(true);
    setCharPreview(char);
    if (window.hanziWriterInstance) {
      window.hanziWriterInstance.setCharacter(word);
    }
  };

  const hideButton = () => {
    setShowPreview(false);
  };

  const handleTouchStart = (event) => {
    if (event.target.tagName === 'BUTTON') {
      event.target.classList.add("touch-active");
    }
  };

  const handleTouchEnd = (event) => {
    if (event.target.tagName === 'BUTTON') {
      event.target.classList.remove("touch-active");
    }
  };

  const loadGoogleTagManager = () => {
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtag/js?id=G-3WZGC6L37P";
      document.head.appendChild(script);
      script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          window.dataLayer.push(arguments);
        }
        gtag("js", new Date());
        gtag("config", "G-3WZGC6L37P");
      };
    }
  };

  useEffect(() => {
    loadGoogleTagManager();
    document.addEventListener("touchstart", handleTouchStart, true);
    document.addEventListener("touchend", handleTouchEnd, true);

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
      setProblems(shuffleArray(DATA.slice(difficulty[0], difficulty[1])));
    }

    return () => {
      document.removeEventListener("touchstart", handleTouchStart, true);
      document.removeEventListener("touchend", handleTouchEnd, true);
    };
  }, []);

  const currentProblem = problems[(numRounds - 1) % problems.length];

  return (
    <div className="app-container">
      <header className="header">
        <h1>Hanzi Practice</h1>
        <p>Draw the character based on the hints below</p>
      </header>

      <div className="nav-bar">
        <button className="nav-btn active">Practice</button>
        <button className="nav-btn" onClick={navigateToMultiplayer}>Multiplayer</button>
        <button className="settings-btn" onClick={() => setShowSettings(true)}>Settings</button>
      </div>

      <Score 
        numCorrect={numCorrect} 
        numRounds={numRounds} 
        currentStreak={currentStreak}
      />

      <div className="hint-card">
        <div className="hint-header">
          <span className="hint-label">Character Hints</span>
        </div>
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

      <div className="game-area">
        <div className="canvas-section">
          <div className="canvas-header">
            <span className="canvas-title">Draw the character</span>
            <div className="canvas-actions">
              <button className="canvas-btn" title="Undo" onClick={undoButton}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 10h10a5 5 0 0 1 5 5v2M3 10l5-5M3 10l5 5"/>
                </svg>
              </button>
              <button className="canvas-btn" title="Clear" onClick={clearButton}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                </svg>
              </button>
              <button className="action-btn skip" onClick={skipButton} style={{ marginLeft: '8px' }}>Skip</button>
            </div>
          </div>
          <div className="canvas-wrapper">
            <Canvas 
              ref={canvasRef} 
              strokes={strokes} 
              setStrokes={setStrokesState} 
              showResults={showResults} 
              isCorrectGuess={isCorrectGuess} 
            />
            <div className="canvas-hint">Draw strokes here</div>
          </div>
        </div>

        <div className="guesses-section">
          <div className="guesses-header">
            <span className="guesses-title">Recognized</span>
            <span className="guesses-hint">Tap to guess</span>
          </div>
          <Guesses strokes={strokes} guess={guess} />
        </div>
      </div>

      <div className="history-section">
        <div className="history-header">
          <span className="history-title">Recent Answers</span>
        </div>
        <div className="history-list">
          <Answers prevAnswers={prevAnswers} onPrevChar={prevChar} />
        </div>
      </div>

      <div id="char-preview" style={{ display: 'none' }}></div>

      <CharPreview ref={charPreviewRef} showPreview={showPreview} char={charPreview} onHide={hideButton} />
      <SettingsModal 
        show={showSettings} 
        onClose={() => setShowSettings(false)} 
        setDifficulty={setDifficultyState} 
        difficulty={difficulty} 
        onReset={resetButton}
        onApply={applyDifficulty} 
      />
    </div>
  );
}
