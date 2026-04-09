import React, { Component } from "react";
import { HanziLookup } from "../../src/hanzilookup.min.js";

class Guesses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: []
        };
    }

    componentDidMount() {
        this.fetchMatches(this.props.strokes);
    }

    componentDidUpdate(prevProps) {
        if (this.props.strokes !== prevProps.strokes) {
            this.fetchMatches(this.props.strokes);
        }
    }

    fetchMatches(strokes) {
        if (!strokes || strokes.length === 0){
            this.setState({results: []});
            return;
        }
        let analyzedChar = new HanziLookup.AnalyzedCharacter(strokes);
        var matcherOrig = new HanziLookup.Matcher("orig");
        matcherOrig.match(analyzedChar, 8, (matches) => {
            let first = matches.map((char) => char.character);
            var matcherMMAH = new HanziLookup.Matcher("mmah");
            matcherMMAH.match(analyzedChar, 8, (matches) => {
                let second = matches.map((char) => char.character);
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
            if (uniqueSet.size >= 8) break;
            if (j < second.length) {
                uniqueSet.add(second[j]);
                j++;
            }
        }
        this.setState({results: [...uniqueSet].slice(0, 8)});
    }
    
    render() {
        const { results } = this.state;
        const { singleRow } = this.props;
        
        const placeholders = Array(8).fill(null).map((_, i) => (
            <div key={`empty-${i}`} className={`guess-item empty ${singleRow ? 'single-row' : ''}`}>?</div>
        ));
        
        const guessItems = results.slice(0, 8).map((char, index) => (
            <div 
                key={index} 
                className={`guess-item chinese-char ${singleRow ? 'single-row' : ''}`}
                onClick={() => this.props.guess?.(char)}
            >
                {char}
            </div>
        ));
        
        const filled = [...guessItems];
        while (filled.length < 8) {
            filled.push(placeholders[filled.length]);
        }
        
        if (singleRow) {
            return (
                <div style={{ 
                    display: 'flex', 
                    gap: '4px', 
                    width: '100%'
                }}>
                    {filled}
                </div>
            );
        }
        
        return (
            <div className="guesses-grid">
                {filled}
            </div>
        );
    }
}

export default Guesses;
