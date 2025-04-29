import React, { useEffect, useRef } from 'react';

const MiniChart = ({ data, change, height = 40, width = 120 }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current || !data || !data.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions with device pixel ratio for sharpness
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    // Scale the context
    ctx.scale(dpr, dpr);
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Find min and max values for scaling
    const minValue = Math.min(...data.filter(value => !isNaN(value)));
    const maxValue = Math.max(...data.filter(value => !isNaN(value)));
    const range = maxValue - minValue;
    
    // Set line style
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Determine color based on change
    const strokeColor = change >= 0 ? '#10B981' : '#EF4444';
    ctx.strokeStyle = strokeColor;
    
    // Draw the sparkline
    ctx.beginPath();
    
    const validData = data.filter(value => !isNaN(value));
    validData.forEach((value, index) => {
      const x = (index / (validData.length - 1)) * width;
      // Normalize value to fit in canvas height
      const yRatio = range === 0 ? 0.5 : (value - minValue) / range;
      const y = height - (yRatio * height * 0.8) - (height * 0.1);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Add a subtle gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    if (change >= 0) {
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
    } else {
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)');
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
    }
    
    ctx.fillStyle = gradient;
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
    
  }, [data, change, height, width]);
  
  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className="inline-block"
    />
  );
};

export default MiniChart;