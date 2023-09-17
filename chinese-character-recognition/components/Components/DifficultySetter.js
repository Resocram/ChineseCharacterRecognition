export default function DifficultySetter(props) {

    return (
        <div>
            <form>
                <label for="difficulty" className="test">Difficulty (How many characters to test, 1-1000):</label>
                <input type ="text" className="test" id="difficulty" name="difficulty"></input>
                <label for="lowerbound" className="test">Lower Bound (dev usage):</label>
                <input type ="text" className="test" id="lowerbound" name="lowerbound"></input>
                <button type="reset" className="button" id="reset">Reset</button>
            </form>
        </div>
    );
}