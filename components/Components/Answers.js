import React from "react";
export default function Answers({ prevAnswers, onPrevChar }) {
    return (
        <>
            {prevAnswers.map((item, index) => (
                <div 
                    key={index} 
                    className="history-item"
                    onClick={() => { onPrevChar(item, null); }}
                >
                    <span className="history-char">
                        {item.answer.char}
                    </span>
                    <div className={`history-status ${item.colour === 'green' ? 'correct' : 'incorrect'}`}></div>
                </div>
            ))}
        </>
    );
}
