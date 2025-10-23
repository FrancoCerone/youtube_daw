import React, { useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';
import { X, Music } from 'lucide-react';
import useDawStore from '../store/dawStore';
import ClipInfo from './ClipInfo';
import { Clip as ClipType } from '../types';
import YouTube from 'react-youtube';

// Funzione per estrarre l'ID YouTube dall'URL
const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

interface ClipProps {
  clip: ClipType;
  trackId: number;
}

const Clip: React.FC<ClipProps> = ({ clip, trackId }) => {
  const { updateClip, removeClip, duration, isPlaying, currentTime, timelineZoom, timelineScroll } = useDawStore();
  const clipRef = useRef<HTMLDivElement>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isResizing, setIsResizing] = useState<'left' | 'right' | null>(null);
  const resizeStartXRef = useRef<number>(0);
  const resizeStartValuesRef = useRef({ startTime: 0, endTime: 0 });

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
  
  // Calcola dimensioni e posizione con zoom
  const totalWidth = duration * timelineZoom * 10; // 10px per secondo
  const clipWidth = (clipDuration / duration) * totalWidth;
  const clipLeft = (clip.startTime / duration) * totalWidth - timelineScroll;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeClip(trackId, clip.id);
  };

  const handleDoubleClick = () => {
    setShowInfo(true);
  };

  const handleUpdateClip = (updates: Partial<ClipType>) => {
    updateClip(trackId, clip.id, updates);
  };

  // Gestione resize - inizio
  const handleResizeStart = (e: React.MouseEvent, side: 'left' | 'right') => {
    e.stopPropagation();
    e.preventDefault();
    
    setIsResizing(side);
    resizeStartXRef.current = e.clientX;
    resizeStartValuesRef.current = {
      startTime: clip.startTime,
      endTime: clip.endTime,
    };
  };

  // Gestione resize - movimento (solo da destra)
  React.useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!clipRef.current) return;
      
      const deltaX = e.clientX - resizeStartXRef.current;
      const deltaTime = deltaX / (timelineZoom * 10); // Converti pixel in tempo con zoom

      // Ridimensiona da destra - cambia solo endTime (durata)
      const newEndTime = Math.min(duration, Math.max(
        resizeStartValuesRef.current.startTime + 1, // Min 1 secondo di durata
        resizeStartValuesRef.current.endTime + deltaTime
      ));
      updateClip(trackId, clip.id, { endTime: newEndTime });
    };

    const handleMouseUp = () => {
      setIsResizing(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, clip.id, trackId, duration, timelineZoom, updateClip]);

  // Determina se questa clip dovrebbe essere in riproduzione
  const shouldPlay = isPlaying && currentTime >= clip.startTime && currentTime < clip.endTime;
  
  // Determina se il video dovrebbe essere visibile/audibile
  // Se il player globale è in play, tutti i video partono ma solo quello attivo ha audio
  const shouldBeActive = shouldPlay;

  return (
    <>
      <motion.div
        ref={(node) => {
          clipRef.current = node;
          drag(node);
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isDragging || isResizing ? 0.3 : 1, 
          scale: isDragging || isResizing ? 0.95 : 1,
        }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        onDoubleClick={handleDoubleClick}
        className={`absolute top-2 bottom-2 bg-gray-900 border-2 rounded-lg shadow-lg overflow-hidden transition-all ${
          isDragging 
            ? 'border-yellow-400 shadow-2xl cursor-grabbing'
            : isResizing
            ? 'border-green-400 shadow-2xl'
            : 'border-blue-500 hover:shadow-xl hover:border-blue-400 cursor-grab'
        }`}
        style={{
          left: `${clipLeft}px`,
          width: `${clipWidth}px`,
          minWidth: '120px',
        }}
      >
        {/* Resize Handle - Solo Destra (controlla la durata/fine della clip) */}
        <div
          onMouseDown={(e) => handleResizeStart(e, 'right')}
          className="absolute right-0 top-0 bottom-0 w-2 bg-blue-400/0 hover:bg-blue-400/50 cursor-ew-resize z-50 group transition-colors"
          style={{ pointerEvents: 'auto' }}
        >
          <div className="absolute inset-y-0 right-0 w-1 bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

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
            <div className="relative w-full h-full">
              {/* Layer 1: Preview sempre visibile (senza audio) */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: shouldBeActive ? 'none' : 'block',
                  opacity: 0.7,
                  pointerEvents: 'none',
                }}
              >
                <YouTube
                  key={`clip-${clip.id}-preview`}
                  videoId={getYouTubeId(clip.url) || undefined}
                  opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: {
                      controls: 0,
                      start: Math.floor(clip.clipStart || 0),
                      mute: 1,
                      autoplay: 0,
                      modestbranding: 1,
                      rel: 0,
                      playsinline: 1,
                    },
                  }}
                />
              </div>
              
              {/* Layer 2: Player attivo (con audio) - si monta solo quando attivo */}
              {shouldBeActive && (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: isDragging ? 'none' : 'auto',
                  }}
                >
                  <YouTube
                    key={`clip-${clip.id}-active`}
                    videoId={getYouTubeId(clip.url) || undefined}
                    opts={{
                      width: '100%',
                      height: '100%',
                      playerVars: {
                        autoplay: 1,
                        controls: 1,
                        start: Math.floor(clip.clipStart || 0),
                        mute: 0,
                        modestbranding: 1,
                        rel: 0,
                        playsinline: 1,
                      },
                    }}
                  />
                </div>
              )}
              
              {/* Overlay quando la clip non è attiva */}
              {!shouldBeActive && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none flex items-end justify-center pb-8">
                  <div className="bg-black/70 px-3 py-1 rounded-full text-xs text-gray-300">
                    {isPlaying ? '⏸️ Waiting' : '⏹️ Ready'}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
              No URL
            </div>
          )}
        </div>
        
        {/* Debug info */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 z-20">
          URL: {clip.url ? '✓' : '✗'} | Active: {shouldBeActive ? 'YES' : 'NO'} | Time: {currentTime.toFixed(1)}s / Range: {clip.startTime}-{clip.endTime}
        </div>

        {/* Overlay per drag - cattura gli eventi durante il drag */}
        {isDragging && (
          <div className="absolute inset-0 bg-blue-500/20 z-50" />
        )}
        
        {/* Overlay trasparente per catturare drag anche quando non in drag - solo sul preview */}
        {!shouldBeActive && !isDragging && (
          <div className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing" style={{ top: '24px' }} />
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

