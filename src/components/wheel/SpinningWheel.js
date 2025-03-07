import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';

const SpinningWheel = () => {
  const segments = [
    { color: '#000', label: 'Black' },
    { color: '#ffd2d2', label: 'Pink' },
    { color: '#670000', label: 'Brown' },
    { color: '#93c47d', label: 'Green' },
    { color: '#cc0000', label: 'Red' },
    { color: '#e5c2d1', label: 'Lavender' }
  ];

  const segmentAngle = 360 / segments.length;
  
  // Ensure the wheel starts at the beginning of a segment
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);

  // Ensure the initial rotation aligns with the first segment
  useEffect(() => {
    setRotation(0); // Start exactly at the 0° of the first segment
  }, []);

  const spinWheel = () => {
    const spins = Math.floor(Math.random() * 3) + 5; // Random spins between 5-7

    // Pick a random segment to stop at
    const selectedIndex = Math.floor(Math.random() * segments.length);
    const stopAngle = selectedIndex * segmentAngle;

    // Calculate total rotation so that it stops exactly at segment start
    const randomRotation = spins * 360 + stopAngle;

    setRotation(randomRotation);

    setTimeout(() => {
      setResult(segments[selectedIndex].label);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 400 400" 
          style={{ width: "300px", height: "300px" }}
        >
          <g 
            transform={`rotate(${rotation}, 200, 200)`} 
            style={{ transition: 'transform 3s ease-out' }}
          >
            {segments.map((segment, index) => {
              const startAngle = index * segmentAngle;
              const endAngle = startAngle + segmentAngle;
              const x1 = 200 + 180 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 200 + 180 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 200 + 180 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 200 + 180 * Math.sin((endAngle * Math.PI) / 180);

              return (
                <path
                  key={segment.label}
                  d={`M200,200 L${x1},${y1} A180,180 0 0,1 ${x2},${y2} Z`}
                  fill={segment.color}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              );
            })}
          </g>
          
          {/* Pointer */}
          <polygon 
            points="200,30 190,10 210,10" 
            fill="red"
          />
        </svg>
      </div>
      
      <Button 
        onClick={spinWheel} 
        variant="contained" 
        color="primary"
      >
        Spin the Wheel
      </Button>
      
      {result && (
        <div className="mt-4 text-xl font-bold">
          🎉 You won: {result} 🎉
        </div>
      )}
    </div>
  );
};

export default SpinningWheel;
