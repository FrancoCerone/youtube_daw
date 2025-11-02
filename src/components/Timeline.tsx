import React, { useRef, useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import useDawStore from '../store/dawStore';

const Timeline: React.FC = () => {
  const { 
    duration, 
    currentTime, 
    isPlaying,
    isLooping,
    loopStart,
    loopEnd,
    timelineZoom, 
    timelineScroll,
    setCurrentTime,
    setTimelineZoom, 
    setTimelineScroll,
    setLoopStart,
    setLoopEnd,
    resetTimelineView 
  } = useDawStore();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scroll: 0 });
  const [draggingLoopMarker, setDraggingLoopMarker] = useState<'start' | 'end' | null>(null);
  const [draggingPlayhead, setDraggingPlayhead] = useState(false);

  // Genera i marker temporali con zoom
  const markers: number[] = [];
  const baseInterval = 10; // un marker ogni 10 secondi
  const interval = baseInterval / timelineZoom; // intervallo adattato al zoom
  for (let i = 0; i <= duration; i += interval) {
    markers.push(i);
  }

  // Calcola la larghezza totale della timeline con zoom (deve essere prima degli altri handler)
  const totalWidth = duration * timelineZoom * 10; // 10px per secondo

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

  // Click sulla timeline per saltare a quel punto
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (isDragging || draggingLoopMarker || draggingPlayhead) return;
    
    const rect = timelineRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left + timelineScroll;
    const time = (x / totalWidth) * duration;
    
    setCurrentTime(time);
    console.log('⏭️ Jumped to:', time.toFixed(2), 's');
  };

  // Drag del playhead
  const handlePlayheadMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingPlayhead(true);
  };

  useEffect(() => {
    if (!draggingPlayhead) return;

    const handlePlayheadMouseMove = (e: MouseEvent) => {
      if (!timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left + timelineScroll;
      const time = Math.max(0, Math.min(duration, (x / totalWidth) * duration));
      
      setCurrentTime(time);
    };

    const handlePlayheadMouseUp = () => {
      setDraggingPlayhead(false);
    };

    document.addEventListener('mousemove', handlePlayheadMouseMove);
    document.addEventListener('mouseup', handlePlayheadMouseUp);

    return () => {
      document.removeEventListener('mousemove', handlePlayheadMouseMove);
      document.removeEventListener('mouseup', handlePlayheadMouseUp);
    };
  }, [draggingPlayhead, duration, timelineScroll, totalWidth, setCurrentTime]);

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

  // Gestione drag dei marker loop
  const handleLoopMarkerMouseDown = (e: React.MouseEvent, marker: 'start' | 'end') => {
    e.stopPropagation();
    setDraggingLoopMarker(marker);
  };

  useEffect(() => {
    if (!draggingLoopMarker) return;

    const handleLoopMouseMove = (e: MouseEvent) => {
      if (!timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left + timelineScroll;
      const time = (x / totalWidth) * duration;

      if (draggingLoopMarker === 'start') {
        setLoopStart(time);
      } else {
        setLoopEnd(time);
      }
    };

    const handleLoopMouseUp = () => {
      setDraggingLoopMarker(null);
    };

    document.addEventListener('mousemove', handleLoopMouseMove);
    document.addEventListener('mouseup', handleLoopMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleLoopMouseMove);
      document.removeEventListener('mouseup', handleLoopMouseUp);
    };
  }, [draggingLoopMarker, duration, timelineScroll, totalWidth, setLoopStart, setLoopEnd]);

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
        onClick={handleTimelineClick}
        style={{ cursor: isDragging ? 'grabbing' : draggingPlayhead ? 'grabbing' : 'grab' }}
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

        {/* Loop Region - Area evidenziata */}
        {isLooping && (
          <div
            className="absolute top-0 bottom-0 bg-orange-500/20 border-l-2 border-r-2 border-orange-500 pointer-events-none z-5"
            style={{
              left: `${(loopStart / duration) * totalWidth - timelineScroll}px`,
              width: `${((loopEnd - loopStart) / duration) * totalWidth}px`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent" />
          </div>
        )}

        {/* Loop Marker - Start */}
        {isLooping && (
          <div
            className="absolute top-0 bottom-0 w-1 bg-orange-500 z-20 cursor-ew-resize hover:w-2 transition-all"
            style={{ left: `${(loopStart / duration) * totalWidth - timelineScroll}px` }}
            onMouseDown={(e) => handleLoopMarkerMouseDown(e, 'start')}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded shadow-lg whitespace-nowrap pointer-events-none">
              ↻ {formatTime(loopStart)}
            </div>
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-500 rounded-full shadow-lg pointer-events-none" />
          </div>
        )}

        {/* Loop Marker - End */}
        {isLooping && (
          <div
            className="absolute top-0 bottom-0 w-1 bg-orange-500 z-20 cursor-ew-resize hover:w-2 transition-all"
            style={{ left: `${(loopEnd / duration) * totalWidth - timelineScroll}px` }}
            onMouseDown={(e) => handleLoopMarkerMouseDown(e, 'end')}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded shadow-lg whitespace-nowrap pointer-events-none">
              {formatTime(loopEnd)} ↻
            </div>
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-500 rounded-full shadow-lg pointer-events-none" />
          </div>
        )}

        {/* Playhead - cursore di riproduzione TRASCINABILE */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30 transition-opacity group"
          style={{ 
            left: `${(currentTime / duration) * totalWidth - timelineScroll}px`,
            boxShadow: isPlaying ? '0 0 10px rgba(239, 68, 68, 0.6)' : 'none',
            cursor: 'ew-resize',
            pointerEvents: 'auto',
          }}
          onMouseDown={handlePlayheadMouseDown}
        >
          {/* Area di hover allargata per facilitare il grab */}
          <div className="absolute inset-y-0 -left-2 -right-2" />
          
          {/* Diamante in alto */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rotate-45 shadow-lg group-hover:w-4 group-hover:h-4 transition-all">
            {isPlaying && (
              <div className="absolute inset-0 bg-red-400 animate-ping opacity-75" />
            )}
          </div>
          
          {/* Tooltip quando hover */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-0.5 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Drag to seek
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;

