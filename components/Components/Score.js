export default function Score({ numCorrect, numRounds, currentStreak }) {
    return (
        <div className="score-bar">
            <div className="score-item">
                <span className="label">Round</span>
                <span className="value">{numRounds}</span>
            </div>
            <div className="score-divider"></div>
            <div className="score-item">
                <span className="label">Score</span>
                <span className="value">{numRounds > 1 ? `${numCorrect}/${numRounds - 1}` : '-'}</span>
            </div>
            <div className="score-divider"></div>
            <div className="score-item">
                <span className="label">Streak</span>
                <span className="value streak">{currentStreak}</span>
            </div>
        </div>
    );
}
