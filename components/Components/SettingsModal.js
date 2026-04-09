import React from 'react';
import DifficultySetter from './DifficultySetter';

export default function SettingsModal(props) {
  const handleReset = () => {
    props.onReset();
    props.onClose();
  }

  const handleOk = () => {
    props.onApply();
    props.onClose();
  }

  return (
    <div 
      className={`modal-overlay ${props.show ? 'show' : ''}`}
      onClick={props.onClose}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 className="difficulty-header" style={{ margin: 0 }}>Difficulty Settings</h2>
          <button 
            onClick={props.onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              fontSize: '20px',
              lineHeight: 1
            }}
          >
            ✕
          </button>
        </div>
        <p style={{ marginBottom: '20px', color: 'var(--text-muted)', fontSize: '14px' }}>
          Adjust the range of characters based on frequency
        </p>
        <DifficultySetter setDifficulty={props.setDifficulty} difficulty={props.difficulty} />
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button 
            type="button" 
            className="action-btn skip" 
            onClick={handleReset} 
            style={{ flex: 1 }}
          >
            Reset to Default
          </button>
          <button 
            type="button" 
            className="action-btn hint" 
            onClick={handleOk} 
            style={{ flex: 1 }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
