export default function Pinyin(props) {
    return (
        <div>
            <h2 className="header">Pinyin</h2>
            <p>{props.pinyin}</p>
        </div>
    );
}