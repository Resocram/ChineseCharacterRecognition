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
    setIsNextClicked(false); // Reset the button state when the round changes
  }, [round]);

  return (
    <div>
      <div className="commands">
        <button type="button" className="button" onClick={onUndo}>
          Undo
        </button>
        <button type="button" className="button" onClick={onClear}>
          Clear
        </button>
        <button
          type="button"
          className="button"
          onClick={handleNextClick}
          disabled={disableNextAfterClick && isNextClicked}
        >
          Next
        </button>
      </div>
    </div>
  );
}
