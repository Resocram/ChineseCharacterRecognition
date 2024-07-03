export default function DailyScore(props) {
    return (
        <div>
            <h3 className="header">Score: {props.correct && "SLAYED"}</h3>
        </div>
    );
}