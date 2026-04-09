export default function CharacterFormation({ charFormation }) {
    if (!charFormation || charFormation.length === 0) return null;
    
    return (
      <div style={{ marginTop: '16px', padding: '16px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Character Components
        </div>
        {charFormation.map((charInfo, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: '24px' }}>{charInfo.char}</span>
            <span style={{ fontSize: '13px', color: 'var(--accent-secondary)' }}>{charInfo.pinyin}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{charInfo.def}</span>
          </div>
        ))}
      </div>
    );
  }
