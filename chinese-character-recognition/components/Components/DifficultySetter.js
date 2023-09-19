import React, { Component } from 'react';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      isDrawing: false,
      strokes: [], // Array to store strokes
      currentStroke: [], // Array to store the current stroke being drawn
    };
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.addEventListener('mousedown', this.startDrawing);
    this.canvas.addEventListener('mousemove', this.draw);
    this.canvas.addEventListener('mouseup', this.stopDrawing);
    this.canvas.addEventListener('mouseout', this.stopDrawing);
    this.captureInterval = null; // Interval for capturing points
  }

  componentWillUnmount() {
    this.canvas.removeEventListener('mousedown', this.startDrawing);
    this.canvas.removeEventListener('mousemove', this.draw);
    this.canvas.removeEventListener('mouseup', this.stopDrawing);
    this.canvas.removeEventListener('mouseout', this.stopDrawing);
    clearInterval(this.captureInterval); // Clear the capture interval
  }

  startDrawing = (event) => {
    const { offsetX, offsetY } = this.getMousePosition(event);
    this.setState({ isDrawing: true });
    this.setState({ currentStroke: [{ x: offsetX, y: offsetY }] }); // Start a new stroke
    this.captureInterval = setInterval(() => this.capturePoint(event), 50); // Capture points every 50ms
  };

  draw = (event) => {
    if (!this.state.isDrawing) return;
    const { offsetX, offsetY } = this.getMousePosition(event);
    const currentPoint = { x: offsetX, y: offsetY };
  
    // Get the previous point
    const lastPoint = this.state.currentStroke[this.state.currentStroke.length - 1];
  
    // Draw the new line segment from the previous point to the current point
    this.drawSegment(lastPoint, currentPoint);
  
    // Add the current point to the current stroke
    this.setState((prevState) => ({
      currentStroke: [...prevState.currentStroke, currentPoint],
    }));
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
      this.setState((prevState) => ({
        isDrawing: false,
        strokes: [...prevState.strokes, prevState.currentStroke],
        currentStroke: [], // Clear the current stroke
      }));
    }
  };

  capturePoint = (event) => {
    if (!this.state.isDrawing) return;
    const { offsetX, offsetY } = this.getMousePosition(event);
    const currentPoint = { x: offsetX, y: offsetY };

    // Check if the current point is different from the last point
    const lastPoint = this.state.currentStroke[this.state.currentStroke.length - 1];
    if (lastPoint.x !== currentPoint.x || lastPoint.y !== currentPoint.y) {
      this.setState((prevState) => ({
        currentStroke: [...prevState.currentStroke, currentPoint],
      }));
    }
  };

  getMousePosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
  }

  render() {
    return <canvas ref={this.canvasRef} width={300} height={300}></canvas>;
  }
}

export default Canvas;