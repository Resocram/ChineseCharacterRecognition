import React from 'react';

export default function Buttons({ onUndo, onClear, onNext }) {
  return (
    <div>
      <div className="commands">
        <button type="button" className="button" onClick={onUndo}>
          Undo
        </button>
        <button type="button" className="button" onClick={onClear}>
          Clear
        </button>
        <button type="button" className="button" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
}