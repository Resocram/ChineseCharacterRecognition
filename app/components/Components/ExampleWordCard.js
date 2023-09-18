export default function ExampleWordCard(props) {
    let answers = props.char;
    let simpAnswer = answers[0];
    let tradAnswer = answers[0];
    if (answers.indexOf("F") !== -1) {
        tradAnswer = answers[answers.indexOf("F") + 1]
    }

    return (
        <div>
            <p>{props.char.replace(simpAnswer,"__").replace(tradAnswer, "__")} {props.pinyin + props.definition}</p>
        </div>
    );
}