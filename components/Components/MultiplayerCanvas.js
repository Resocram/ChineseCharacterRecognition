import React, { Component } from "react";

class MultiplayerCanvas extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
            strokes: props.strokes
        };
    }

    renderStrokes = () => {
        const { strokes } = this.props;
        strokes.forEach((stroke) => {
            for (let i = 0; i < stroke.length - 1; i++) {
                const startPoint = { x: stroke[i][0], y: stroke[i][1] };
                const endPoint = { x: stroke[i + 1][0], y: stroke[i + 1][1] };
                this.drawSegment(startPoint, endPoint);
            }
        });
    };

    clearCanvas = () => {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    componentDidMount() {
        this.canvas = this.canvasRef.current;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.lineWidth = 4; // Set pen thickness
        this.ctx.strokeStyle = "black"; // Set pen color
    }

    componentDidUpdate(prevProps) {
        if (prevProps.strokes !== this.props.strokes) {
            this.setState({ strokes: this.props.strokes }, () => {
                this.clearCanvas();
                this.renderStrokes();
            });
        }
    }

    drawSegment = (startPoint, endPoint) => {
        this.ctx.beginPath();
        this.ctx.moveTo(startPoint.x, startPoint.y);
        this.ctx.lineTo(endPoint.x, endPoint.y);
        this.ctx.stroke();
        this.ctx.closePath();
    };


    render() {
        return (
            <div style={{ position: 'relative' }}>
                <div className="canvas-background"></div>
                <canvas id="canvas" ref={this.canvasRef} width={300} height={300}></canvas>
                <div className={`popup ${this.props.showResults ? "fade-in" : "fade-out"} ${this.props.isCorrectGuess ? "correct-popup" : "incorrect-popup"}`}>
                    {this.props.isCorrectGuess ? "Correct" : "Try Again"}
                </div>
            </div>
        );
    }
}

export default MultiplayerCanvas;