import ExampleWordCard from "./ExampleWordCard";

export default function ExampleWords(props) {
    if (!props.words || props.words.length === 0) return null;
    
    return (
        <>
            {props.words.slice(0, Math.min(3, props.words.length)).map((word, i) => (
                <ExampleWordCard 
                    key={i} 
                    char={props.char} 
                    exampleWordChar={word.char} 
                    pinyin={word.pinyin} 
                    definition={word.definition}
                />
            ))}
        </>
    );
}
