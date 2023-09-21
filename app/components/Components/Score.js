export default function Score(props) {
    let score = props.numCorrect / props.numRounds;

    return (
        <div>
            <h2 className="header">Score: {(props.numRounds > 0) && score}</h2>
        </div>
    );
}