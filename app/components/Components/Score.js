export default function Score(props) {
    return (
        <div>
            <h2 className="header">Score: {(props.numRounds > 2) && `${props.numCorrect} / ${props.numRounds}`}</h2>
        </div>
    );
}