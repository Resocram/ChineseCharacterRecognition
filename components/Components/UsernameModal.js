import React, { useState } from 'react';

export default function UsernameModal({ show, initialValue, onSubmit, onCancel, standalone }) {
  const [value, setValue] = useState(initialValue || '');

  if (!show) return null;

  const submit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  const form = (
    <form onSubmit={submit}>
      <h1 style={standalone ? undefined : { fontSize: '20px', marginBottom: '8px' }}>
        {standalone ? 'Enter Your Name' : 'Change Username'}
      </h1>
      {standalone && (
        <p className="loading-note" style={{ color: 'var(--text-muted)', background: 'transparent', border: 'none' }}>
          Choose a name so other players can see you in the lobby
        </p>
      )}
      <input
        type="text"
        autoFocus
        maxLength={20}
        className="username-input"
        placeholder="Your name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
        {onCancel && (
          <button type="button" className="action-btn skip" style={{ flex: 1 }} onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="action-btn hint" style={{ flex: 1 }} disabled={!value.trim()}>
          Continue
        </button>
      </div>
    </form>
  );

  if (standalone) {
    return (
      <div className="loading-container">
        <div className="loading-card">{form}</div>
      </div>
    );
  }

  return (
    <div className="modal-overlay show" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {form}
      </div>
    </div>
  );
}
