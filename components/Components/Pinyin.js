export default function Pinyin({pinyin}) {
    return (
        <div className="hint-item">
            <div className="label">Pinyin</div>
            <div className="pinyin">{pinyin}</div>
        </div>
    );
}
