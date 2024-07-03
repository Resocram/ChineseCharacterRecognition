export default function Score(props) {
    return (
        <div>
            <h2 className="header">Score: {(props.numRounds > 1) && `${props.numCorrect} / ${props.numRounds-1}`}</h2>
        </div>
    );
}