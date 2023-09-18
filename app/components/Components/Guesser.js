import DrawingBoard from "./DrawingBoard";

export default function Guesser() {
    return (
        <div>
            <DrawingBoard />
            <div className="commands">
                <button type="button" className="button cmdUndo">Undo</button>
                <button type="button" className="button cmdClear">Clear</button>
                <button type="button" className="button" id="next">Next</button>
            </div>
        </div>
    );
}