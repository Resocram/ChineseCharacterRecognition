import React from 'react';

export default function PlayerCard({ player, color, isCurrentPlayer }) {
  return (
    <div style={{ 
      padding: '12px 16px',
      background: isCurrentPlayer ? 'var(--accent-primary)' : 'var(--bg-card)',
      borderRadius: 'var(--radius-md)',
      borderLeft: `4px solid ${color || 'var(--accent-secondary)'}`,
      marginBottom: '12px'
    }}>
      <div style={{ 
        fontWeight: 600, 
        fontSize: '16px',
        color: isCurrentPlayer ? 'white' : 'var(--text-primary)'
      }}>
        {player.username} {isCurrentPlayer && '(You)'}
      </div>
      <div style={{ 
        color: isCurrentPlayer ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)', 
        fontSize: '14px', 
        marginTop: '4px' 
      }}>
        Score: {player.score || 0}
      </div>
    </div>
  );
}
