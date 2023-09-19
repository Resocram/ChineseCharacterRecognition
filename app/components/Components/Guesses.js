import React, { Component } from "react";
import { HanziLookup } from "../../src/hanzilookup.min.js";

class Guesses extends Component {
    componentDidMount() {

    }

    
    componentWillUnmount() {
        // Cleanup or teardown logic can be placed here
    }
    
    render() {
        // Render your component
        let { strokes } = this.props;
        console.log(strokes);
        
        // Declare variables for results
        let first = [];
        let second = [];
        
        // Create an AnalyzedCharacter instance
        if (strokes.every(stroke => stroke.length >= 2)){
            var analyzedChar = new HanziLookup.AnalyzedCharacter(strokes);
            
            // Look up with original HanziLookup data
            var matcherOrig = new HanziLookup.Matcher("orig");
            matcherOrig.match(analyzedChar, 8, function(matches) {
                first = matches.map(char => char.character);
                console.log("FIRST")
                console.log(first)
                // Call showResults() here if it's defined
            });
            
            // Look up with MMAH data
            var matcherMMAH = new HanziLookup.Matcher("mmah");
            matcherMMAH.match(analyzedChar, 8, function(matches) {
                second = matches.map(char => char.character);
                console.log("SECOND")
                console.log(second)
                // Call showResults() here if it's defined
            });
            
            console.log(this.props.strokes);
            
            return (
                <div>
                    <h1>Test</h1>
                    {/* Render your results here */}
                    <div>
                        <h2>First Results</h2>
                        <ul>
                            {first.map((char, index) => (
                                <li key={index}>{char}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2>Second Results</h2>
                        <ul>
                            {second.map((char, index) => (
                                <li key={index}>{char}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            );
        }
    }
}

export default Guesses;