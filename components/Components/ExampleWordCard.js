export default function ExampleWordCard(props) {
    let answers = props.char;
    let simpAnswer = answers[0];
    let tradAnswer = answers;
    if (answers.indexOf("(") !== -1) {
        tradAnswer = answers[answers.indexOf("(") + 1]
    }
    
    const def = props.definition.replaceAll(simpAnswer, "__").replaceAll(tradAnswer, "__");
    
    return (
        <div className="example-word">
            <span className="char">{props.exampleWordChar.replaceAll(simpAnswer, "__").replaceAll(tradAnswer, "__")}</span>
            <span className="def">{props.pinyin} {def}</span>
        </div>
    );
}
