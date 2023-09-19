import React, { Component } from "react";
import { HanziLookup } from "../../src/hanzilookup.min.js";

class Guesses extends Component {
    componentDidMount() {

    }

    
    componentWillUnmount() {
        // Cleanup or teardown logic can be placed here
    }
    showResults(){
        // var displaying = new Set()
        // let i, l = Math.min(first.length, second.length);
        // var result = []
        // for (i = 0; i < l; i++) {
        //     result.push(first[i], second[i]);
        // }
        // result.push(...first.slice(l), ...second.slice(l));
        // displaying = new Set(result)
        // newArray = Array.from(displaying)
        // for (let i = 0; i < newArray.length && i < 8; i++){
        //     $(`#chinese${i}`).text(`${newArray[i]}`);
    
    }
    render() {
        // Render your component
        let { strokes } = this.props;
        console.log(strokes);
        
        // Declare variables for results
        
        // Create an AnalyzedCharacter instance
        
        let first = [];
        let second = [];
        var analyzedChar = new HanziLookup.AnalyzedCharacter(strokes);
        console.log(analyzedChar)
        // Look up with original HanziLookup data
        var matcherOrig = new HanziLookup.Matcher("orig");
        matcherOrig.match(analyzedChar, 8, function(matches) {
            first = matches.map(char => char.character);
            // Call showResults() here if it's defined
        });
        console.log("FIRST")
        console.log(first)
        
        // Look up with MMAH data
        var matcherMMAH = new HanziLookup.Matcher("mmah");
        matcherMMAH.match(analyzedChar, 8, function(matches) {
            second = matches.map(char => char.character);
            // Call showResults() here if it's defined
        });
        console.log("SECOND")
        console.log(second)
        
        console.log(this.props.strokes);
        
        return (
            <div>
                <h1>Test</h1>
                {/* Render your results here */}
                <div>
                    <h2>First Results</h2>
                    <ul>
                        {first.slice(8).map((char, index) => (
                            <li key={index}>{char}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h2>Second Results</h2>
                    <ul>
                        {second.slice(8).map((char, index) => (
                            <li key={index}>{char}</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
        
    }
}

export default Guesses;