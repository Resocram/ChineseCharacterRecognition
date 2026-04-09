import React from "react";
export default function Answers({ prevAnswers, onPrevChar, sessionMap }) {
    return (
        <>
            {prevAnswers.map((item, index) => {
                let statusClass = '';
                let statusStyle = {};
                
                if (item.colour === 'green' || item.colour === 'red') {
                    statusClass = item.colour === 'green' ? 'correct' : 'incorrect';
                } else if (item.colour) {
                    statusStyle = { backgroundColor: item.colour };
                } else {
                    statusClass = 'skipped';
                }
                
                return (
                    <div 
                        key={index} 
                        className="history-item"
                        onClick={() => { onPrevChar(item, null); }}
                    >
                        <span className="history-char">
                            {item.answer.char}
                        </span>
                        <div className={`history-status ${statusClass}`} style={statusStyle}>
                            {!item.colour && item.colour !== 'green' && item.colour !== 'red' ? '×' : ''}
                        </div>
                    </div>
                );
            })}
        </>
    );
}
