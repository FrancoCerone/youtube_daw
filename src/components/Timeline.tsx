import React, { useRef, useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import useDawStore from '../store/dawStore';

const Timeline: React.FC = () => {
  const { 
    duration, 
    currentTime, 
    isPlaying, 
    timelineZoom, 
    timelineScroll,
    setTimelineZoom, 
    setTimelineScroll, 
    resetTimelineView 
  } = useDawStore();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scroll: 0 });

  // Genera i marker temporali con zoom
  const markers: number[] = [];
  const baseInterval = 10; // un marker ogni 10 secondi
  const interval = baseInterval / timelineZoom; // intervallo adattato al zoom
  for (let i = 0; i <= duration; i += interval) {
    markers.push(i);
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Gestione zoom con mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = timelineZoom * zoomFactor;
    setTimelineZoom(newZoom);
  };

  // Gestione drag per scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle mouse o Alt+Left
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX, scroll: timelineScroll });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const newScroll = Math.max(0, dragStart.scroll - deltaX);
      setTimelineScroll(newScroll);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  // Calcola la larghezza totale della timeline con zoom
  const totalWidth = duration * timelineZoom * 10; // 10px per secondo

  return (
    <div className="bg-gray-900 border-b border-gray-700 relative">
      {/* Controlli zoom */}
      <div className="absolute top-2 right-2 flex gap-1 z-20">
        <button
          onClick={() => setTimelineZoom(timelineZoom * 0.8)}
          className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
          title="Zoom Out"
        >
          <ZoomOut size={14} />
        </button>
        <button
          onClick={() => setTimelineZoom(timelineZoom * 1.25)}
          className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
          title="Zoom In"
        >
          <ZoomIn size={14} />
        </button>
        <button
          onClick={resetTimelineView}
          className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
          title="Reset View"
        >
          <RotateCcw size={14} />
        </button>
        <span className="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded">
          {Math.round(timelineZoom * 100)}%
        </span>
      </div>

      <div 
        className="h-12 relative overflow-hidden"
        ref={timelineRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Container scrollabile per la timeline */}
        <div 
          className="absolute inset-0 flex"
          style={{ 
            width: `${totalWidth}px`,
            transform: `translateX(-${timelineScroll}px)`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          {/* Marker temporali */}
          {markers.map((time) => (
            <div
              key={time}
              className="flex-shrink-0 border-l border-gray-700 relative"
              style={{ width: `${(interval / duration) * totalWidth}px` }}
            >
              <span className="absolute top-2 left-2 text-xs text-gray-400 font-mono">
                {formatTime(time)}
              </span>
            </div>
          ))}
        </div>

        {/* Playhead - cursore di riproduzione */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none transition-opacity"
          style={{ 
            left: `${(currentTime / duration) * totalWidth - timelineScroll}px`,
            boxShadow: isPlaying ? '0 0 10px rgba(239, 68, 68, 0.6)' : 'none'
          }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rotate-45 shadow-lg">
            {isPlaying && (
              <div className="absolute inset-0 bg-red-400 animate-ping opacity-75" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;

