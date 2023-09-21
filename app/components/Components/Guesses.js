import React, { Component } from "react";
import { HanziLookup } from "../../src/hanzilookup.min.js";

class Guesses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: new Array(8).fill(' ')
        };
    }

    componentDidMount() {
        // Fetch matches initially
        this.fetchMatches(this.props.strokes);
    }

    componentWillUnmount() {
        // Cleanup or teardown logic can be placed here
    }

    componentDidUpdate(prevProps) {
        if (this.props.strokes !== prevProps.strokes) {
            this.fetchMatches(this.props.strokes);
        }
    }

    fetchMatches(strokes) {
        if (strokes.length === 0 ){
            this.setState({results:[]})
        }
        let analyzedChar = new HanziLookup.AnalyzedCharacter(strokes);
        // Look up with original HanziLookup data
        var matcherOrig = new HanziLookup.Matcher("orig");
        matcherOrig.match(analyzedChar, 8, (matches) => {
            let first = matches.map((char) => char.character);
            // Look up with MMAH data
            var matcherMMAH = new HanziLookup.Matcher("mmah");
            matcherMMAH.match(analyzedChar, 8, (matches) => {
                let second = matches.map((char) => char.character);

                // Call showResults with the newest first and second arrays
                this.showResults(first, second);
            });
        });
    }

    showResults(first, second) {
        const uniqueSet = new Set();
        let i = 0;
        let j = 0;
            while (uniqueSet.size < 8 && (i < first.length || j < second.length)) {
            if (i < first.length) {
                uniqueSet.add(first[i]);
                i++;
            }
            if (j < second.length) {
                uniqueSet.add(second[j]);
                j++;
            }
        }
        this.setState({results:[...uniqueSet]});
    
    }


    render() {
        return (
            <div>
                <div id="recognized-characters">
                    <h2>Recognized Characters</h2>
                    <div className="horizontal-list">
                        {this.state.results.map((char, index) => (
                            <span key={index} className="chinese">
                                {char}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Guesses;