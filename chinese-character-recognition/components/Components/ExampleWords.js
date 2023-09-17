import ExampleWordCard from "./ExampleWordCard";

export default function ExampleWords(props) {
    return (
        <div>
            <h3 className="header">Example Words</h3>
            {props.words.map((word, i) => (
                    <ExampleWordCard key={i} char={word.char} pinyin={word.pinyin} definition={word.definition}/>
                ))}
        </div>
    );
}