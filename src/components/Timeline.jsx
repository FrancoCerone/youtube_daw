import React, { useEffect, useRef } from 'react';
import useDawStore from '../store/dawStore';

const Timeline = () => {
  const { duration, currentTime, playheadPosition } = useDawStore();
  const timelineRef = useRef(null);

  // Genera i marker temporali
  const markers = [];
  const interval = 10; // un marker ogni 10 secondi
  for (let i = 0; i <= duration; i += interval) {
    markers.push(i);
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900 border-b border-gray-700 relative" ref={timelineRef}>
      <div className="h-12 relative">
        {/* Marker temporali */}
        <div className="absolute inset-0 flex">
          {markers.map((time) => (
            <div
              key={time}
              className="flex-shrink-0 border-l border-gray-700 relative"
              style={{ width: `${(interval / duration) * 100}%` }}
            >
              <span className="absolute top-2 left-2 text-xs text-gray-400 font-mono">
                {formatTime(time)}
              </span>
            </div>
          ))}
        </div>

        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rotate-45"></div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;

