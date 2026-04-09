export default function ExampleWordCard(props) {
    let answers = props.char;
    let simpAnswer = answers[0];
    let tradAnswer = answers;
    if (answers.indexOf("(") !== -1) {
        tradAnswer = answers[answers.indexOf("(") + 1]
    }
    
    const highlightedWord = props.exampleWordChar;
    const def = props.definition;
    
    return (
        <div className="example-word">
            <span className="char">{highlightedWord}</span>
            <span className="def">{props.pinyin}</span>
        </div>
    );
}
