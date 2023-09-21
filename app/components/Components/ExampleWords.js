import ExampleWordCard from "./ExampleWordCard";

export default function ExampleWords(props) {
    return (
        <div>
            <h2 className="header">Example Words</h2>
            {props.words.slice(0, Math.min(3, props.words.length)).map((word, i) => (
                <ExampleWordCard key={i} char={props.char} exampleWordChar={word.char} pinyin={word.pinyin} definition={word.definition}/>
            ))}
        </div>
    );
}