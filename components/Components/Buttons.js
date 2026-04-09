import React, { useState, useEffect } from 'react';

export default function Buttons({ onUndo, onClear, onNext, disableNextAfterClick, round }) {
  const [isNextClicked, setIsNextClicked] = useState(false);

  const handleNextClick = () => {
    if (disableNextAfterClick) {
      setIsNextClicked(true);
    }
    if (onNext) onNext();
  };

  useEffect(() => {
    setIsNextClicked(false);
  }, [round]);

  return (
    <div className="commands">
      <button type="button" className="canvas-btn" onClick={onUndo} title="Undo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 10h10a5 5 0 0 1 5 5v2M3 10l5-5M3 10l5 5"/>
        </svg>
      </button>
      <button type="button" className="canvas-btn" onClick={onClear} title="Clear">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
        </svg>
      </button>
      <button
        type="button"
        className="action-btn skip"
        onClick={handleNextClick}
        disabled={disableNextAfterClick && isNextClicked}
      >
        Skip
      </button>
    </div>
  );
}
