import React, { Component } from "react";
import HanziLookup from "../../src/hanzilookup.min.js";
class Guesses extends Component {
    componentDidMount() {
        // Access the strokes prop
        const { strokes } = this.props;
        // Use the strokes data as needed
        console.log(strokes);
    }

    componentWillUnmount() {
    }

    render() {
        // Render your component
        <h1>test</h1>
    }
}

export default Guesses;





