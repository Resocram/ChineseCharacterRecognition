export default function Score(props) {
    let score = props.numCorrect / props.numRounds;

    return (
        <div>
            <h3 className="header">Score: {(props.numRounds > 0) && score}</h3>
        </div>
    );
}