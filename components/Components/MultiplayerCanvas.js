import React, { Component } from "react";

class MultiplayerCanvas extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
            strokes: props.strokes || []
        };
    }

    renderStrokes = () => {
        const { strokes } = this.props;
        if (!strokes || strokes.length === 0) return;
        
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
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    componentDidMount() {
        this.canvas = this.canvasRef.current;
        if (this.canvas) {
            this.ctx = this.canvas.getContext("2d");
            this.ctx.lineWidth = 4;
            this.ctx.strokeStyle = "#1e293b";
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            this.renderStrokes();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.strokes !== this.props.strokes) {
            this.clearCanvas();
            this.renderStrokes();
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
            <canvas 
                className="drawing-canvas"
                ref={this.canvasRef} 
                width={260} 
                height={260}
                style={{
                    display: 'block',
                    borderRadius: 'var(--radius-sm)',
                    border: '2px dashed var(--border-color)',
                    background: 'white'
                }}
            />
        );
    }
}

export default MultiplayerCanvas;
