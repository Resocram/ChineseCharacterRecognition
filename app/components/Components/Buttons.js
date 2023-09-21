import React from 'react';

export default function Buttons({ onUndo, onClear }) {
  return (
    <div>
      <div className="commands">
        <button type="button" className="button cmdUndo" onClick={onUndo}>
          Undo
        </button>
        <button type="button" className="button cmdClear" onClick={onClear}>
          Clear
        </button>
        <button type="button" className="button" id="next">
          Next
        </button>
      </div>
    </div>
  );
}