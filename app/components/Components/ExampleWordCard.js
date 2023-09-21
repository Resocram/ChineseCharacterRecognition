export default function ExampleWordCard(props) {
    let answers = props.char;
    let simpAnswer = answers;
    let tradAnswer = answers;
    if (answers.indexOf("F") !== -1) {
        tradAnswer = answers[answers.indexOf("F") + 1]
    }
    return (
        <div>
            <p>{props.exampleWordChar.replace(simpAnswer,"__").replace(tradAnswer, "__")} {props.pinyin + props.definition}</p>
        </div>
    );
}