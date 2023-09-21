import React, { Component } from "react";

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
            isDrawing: false,
            currentStrokes: [], // Array to store the current strokes being drawn
            strokes: [],
            position: { clientX: 0, clientY: 0 },
        };
    }

    componentDidMount() {
        this.canvas = this.canvasRef.current;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.lineWidth = 4; // Set pen thickness
        this.ctx.strokeStyle = "black"; // Set pen color
        this.canvas.addEventListener("mousedown", this.startDrawing);
        this.canvas.addEventListener("mousemove", this.draw);
        this.canvas.addEventListener("mouseup", this.stopDrawing);
        this.canvas.addEventListener("mouseout", this.stopDrawing);
        this.captureInterval = null; // Interval for capturing points
    }

    componentWillUnmount() {
        this.canvas.removeEventListener("mousedown", this.startDrawing);
        this.canvas.removeEventListener("mousemove", this.draw);
        this.canvas.removeEventListener("mouseup", this.stopDrawing);
        this.canvas.removeEventListener("mouseout", this.stopDrawing);
        clearInterval(this.captureInterval); // Clear the capture interval
    }

    startDrawing = (event) => {
        const { offsetX, offsetY } = this.getMousePosition(event);
        const currentPoint = { x: offsetX, y: offsetY };
        this.setState((prevState) => ({
            isDrawing: true,
            position: {
              clientX: event.clientX,
              clientY: event.clientY,
            },
            currentStrokes: [...prevState.currentStrokes,[currentPoint]],
            strokes: [...this.props.strokes,[[currentPoint.x,currentPoint.y],[currentPoint.x,currentPoint.y]]]
        }));
        this.captureInterval = setInterval(() => this.capturePoint(), 50); // Capture points every 50ms
    };

    draw = (event) => {
        if (!this.state.isDrawing) return;
        const { offsetX, offsetY } = this.getMousePosition(event);
        const currentPoint = { x: offsetX, y: offsetY };

        this.setState((prevState) => {
            const lastStroke = prevState.currentStrokes[prevState.currentStrokes.length - 1];
            const lastPoint = lastStroke[lastStroke.length - 1];
    
            // Check if the current point is different from the last point
            if (
                lastPoint.x !== currentPoint.x ||
                lastPoint.y !== currentPoint.y
            ) {
                lastStroke.push(currentPoint);
                this.drawSegment(lastPoint, currentPoint);
            }
    
            return {
                currentStrokes: [...prevState.currentStrokes],
                position: {
                    clientX: event.clientX,
                    clientY: event.clientY,
                },
            };
        });
    };

    drawSegment = (startPoint, endPoint) => {
        this.ctx.beginPath();
        this.ctx.moveTo(startPoint.x, startPoint.y);
        this.ctx.lineTo(endPoint.x, endPoint.y);
        this.ctx.stroke();
        this.ctx.closePath();
    };

    stopDrawing = () => {
        if (this.state.isDrawing) {
            clearInterval(this.captureInterval); // Stop capturing points
            // Add the completed stroke to the strokes array
            this.setState(() => ({
                isDrawing: false,
            }));
            this.props.setStrokes(this.state.strokes)
        }
    };

    capturePoint = () => {
        if (!this.state.isDrawing) return;
        const { offsetX, offsetY } = this.getMousePosition(this.state.position);
        const currentPoint = [offsetX, offsetY];
    
        this.setState((prevState) => {
            const strokes = this.state.strokes;
            const lastStroke = strokes[strokes.length - 1] || [];
            const lastPoint = lastStroke[lastStroke.length - 1];
            if (!lastPoint){
                lastStroke.push(currentPoint);
                lastStroke.push(currentPoint);
            }
            else if (lastPoint[0] !== currentPoint[0] || lastPoint[1] !== currentPoint[1]) {
                lastStroke.push(currentPoint);
            }
            return {
                strokes: [...strokes.slice(0, -1), lastStroke]
            };
        });
    };

    getMousePosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top,
        };
    }

    clearButton = () => {
        this.props.setStrokes([]);
        this.clearCanvas();
        this.setState({
            isDrawing: false,
            currentStrokes: [], // Clear the current stroke
            strokes: []
        });
        
        clearInterval(this.captureInterval); // Stop capturing points
    };
    clearCanvas = () => {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    
  
    undoButton = () => {
        this.setState((prevState) => {
            return { 
                currentStrokes: prevState.currentStrokes.slice(0,-1),
                strokes: prevState.strokes.slice(0,-1)
            };
        }, () => {
            this.clearCanvas();
            this.props.setStrokes(this.props.strokes.slice(0,-1))
            this.state.currentStrokes.forEach((stroke) => {
                for (let i = 0; i < stroke.length - 1; i++) {
                    const startPoint = stroke[i];
                    const endPoint = stroke[i + 1];
                    this.drawSegment(startPoint, endPoint);
                }
            });
        });
    };

    render() {
        return (
            <div>
                <canvas id="canvas" ref={this.canvasRef} width={300} height={300}></canvas>
            </div>
        );
    }
}

export default Canvas;