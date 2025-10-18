import React, { useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';
import { X, Music } from 'lucide-react';
import useDawStore from '../store/dawStore';
import ClipInfo from './ClipInfo';

// Funzione per estrarre l'ID YouTube dall'URL
const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const Clip = ({ clip, trackId }) => {
  const { updateClip, removeClip, duration, isPlaying, currentTime } = useDawStore();
  const clipRef = useRef(null);
  const [showInfo, setShowInfo] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: 'CLIP',
    item: { 
      clipId: clip.id, 
      trackId, 
      startTime: clip.startTime,
      endTime: clip.endTime,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const clipDuration = clip.endTime - clip.startTime;
  const widthPercentage = (clipDuration / duration) * 100;
  const leftPercentage = (clip.startTime / duration) * 100;

  const handleDelete = (e) => {
    e.stopPropagation();
    removeClip(trackId, clip.id);
  };

  const handleDoubleClick = () => {
    setShowInfo(true);
  };

  const handleUpdateClip = (updates) => {
    updateClip(trackId, clip.id, updates);
  };

  // Determina se questa clip dovrebbe essere in riproduzione
  const shouldPlay = isPlaying && currentTime >= clip.startTime && currentTime < clip.endTime;

  return (
    <>
      <motion.div
        ref={drag}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isDragging ? 0.3 : 1, 
          scale: isDragging ? 0.95 : 1,
        }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        onDoubleClick={handleDoubleClick}
        className={`absolute top-2 bottom-2 bg-gray-900 border-2 rounded-lg shadow-lg overflow-hidden transition-all ${
          isDragging 
            ? 'border-yellow-400 shadow-2xl cursor-grabbing' 
            : 'border-blue-500 hover:shadow-xl hover:border-blue-400 cursor-grab'
        }`}
        style={{
          left: `${leftPercentage}%`,
          width: `${widthPercentage}%`,
          minWidth: '120px',
        }}
      >
        {/* Header con titolo e delete */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 px-2 py-1 flex items-center justify-between z-10">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <Music size={10} className="flex-shrink-0" />
            <span className="text-xs font-medium truncate">{clip.title || 'Untitled'}</span>
          </div>
          
          <button
            onClick={handleDelete}
            className="flex-shrink-0 hover:bg-red-500 p-0.5 rounded transition-colors"
          >
            <X size={12} />
          </button>
        </div>

        {/* Video YouTube embedded diretto */}
        <div className="absolute inset-0 bg-black" style={{ top: '24px' }}>
          {clip.url ? (
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(clip.url)}?autoplay=${shouldPlay ? 1 : 0}&controls=1&start=${Math.floor(clip.clipStart || 0)}&mute=${shouldPlay ? 0 : 1}`}
              title={clip.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
              No URL
            </div>
          )}
        </div>
        
        {/* Debug info */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 z-20">
          URL: {clip.url ? '✓' : '✗'} | Playing: {shouldPlay ? 'YES' : 'NO'}
        </div>

        {/* Overlay per drag (non blocca il video quando non in drag) */}
        {isDragging && (
          <div className="absolute inset-0 bg-blue-500/20 pointer-events-none" />
        )}
      </motion.div>

      {/* Clip Info Modal */}
      {showInfo && (
        <ClipInfo
          clip={clip}
          onClose={() => setShowInfo(false)}
          onUpdate={handleUpdateClip}
        />
      )}
    </>
  );
};

export default Clip;

