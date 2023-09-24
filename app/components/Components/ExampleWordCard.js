export default function ExampleWordCard(props) {
    let answers = props.char;
    let simpAnswer = answers[0];
    let tradAnswer = answers;
    if (answers.indexOf("(") !== -1) {
        tradAnswer = answers[answers.indexOf("(") + 1]
    }
    return (
        <div>
            <p>{props.exampleWordChar.replace(simpAnswer,"__").replace(tradAnswer, "__")} {props.pinyin + props.definition}</p>
        </div>
    );
}