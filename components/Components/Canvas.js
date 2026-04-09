import React, { Component } from "react";

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
            isDrawing: false,
            currentStrokes: [],
            strokes: [],
            position: { clientX: 0, clientY: 0 },
        };
    }

    componentDidMount() {
        this.canvas = this.canvasRef.current;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.lineWidth = 8;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.strokeStyle = "#1e293b";
        this.canvas.addEventListener("mousedown", this.startDrawing);
        this.canvas.addEventListener("mousemove", this.draw);
        this.canvas.addEventListener("mouseup", this.stopDrawing);
        this.canvas.addEventListener("mouseout", this.stopDrawing);
        this.captureInterval = null;

        this.canvas.addEventListener("touchstart", this.handleTouchStart);
        this.canvas.addEventListener("touchmove", this.handleTouchMove);
        this.canvas.addEventListener("touchend", this.handleTouchEnd);
        this.canvas.addEventListener("touchcancel", this.handleTouchEnd);
    }

    handleTouchStart = (event) => {
        event.preventDefault();
        const touch = event.touches[0];
        this.startDrawing(touch);
    };

    handleTouchMove = (event) => {
        event.preventDefault();
        const touch = event.touches[0];
        this.draw(touch);
    };

    handleTouchEnd = () => {
        this.stopDrawing();
    };

    componentWillUnmount() {
        this.canvas.removeEventListener("mousedown", this.startDrawing);
        this.canvas.removeEventListener("mousemove", this.draw);
        this.canvas.removeEventListener("mouseup", this.stopDrawing);
        this.canvas.removeEventListener("mouseout", this.stopDrawing);
        clearInterval(this.captureInterval);
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
        this.captureInterval = setInterval(() => this.capturePoint(), 50);
    };

    draw = (event) => {
        if (!this.state.isDrawing) return;
        const { offsetX, offsetY } = this.getMousePosition(event);
        const currentPoint = { x: offsetX, y: offsetY };

        this.setState((prevState) => {
            const lastStroke = prevState.currentStrokes[prevState.currentStrokes.length - 1];
            const lastPoint = lastStroke[lastStroke.length - 1];
    
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
            clearInterval(this.captureInterval);
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
            currentStrokes: [],
            strokes: []
        });
        
        clearInterval(this.captureInterval);
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
            <div style={{ position: 'relative' }}>
                <canvas 
                    className="drawing-canvas" 
                    ref={this.canvasRef} 
                    width={300} 
                    height={300}
                ></canvas>
                <div className={`feedback-overlay ${this.props.showResults ? "show" : ""} ${this.props.isCorrectGuess ? "correct" : "incorrect"}`}>
                    {this.props.isCorrectGuess ? "Correct!" : "Try Again"}
                </div>
            </div>
        );
    }
}

export default Canvas;
