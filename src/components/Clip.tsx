import React, { useRef, useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, Settings, Copy, Clipboard, Trash2, Scissors } from 'lucide-react';
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
  const { updateClip, removeClip, copyClip, pasteClip, cutClip, clipboardClip, duration, isPlaying, currentTime, loopRestartCount, timelineZoom, timelineScroll, tracks } = useDawStore();
  const clipRef = useRef<HTMLDivElement>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isResizing, setIsResizing] = useState<'left' | 'right' | null>(null);
  const resizeStartXRef = useRef<number>(0);
  const resizeStartValuesRef = useRef({ startTime: 0, endTime: 0 });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; cutPosition: number } | null>(null);

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

  // Gestione menu contestuale
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Calcola la posizione del taglio basata su dove hai cliccato
    const rect = clipRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clickX = e.clientX - rect.left;
    const clickPercentage = clickX / rect.width;
    const cutPosition = clip.startTime + (clipDuration * clickPercentage);
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      cutPosition: cutPosition,
    });
  };

  const handleCopy = () => {
    copyClip(trackId, clip.id);
    setContextMenu(null);
  };

  const handlePaste = () => {
    pasteClip(trackId, clip.startTime);
    setContextMenu(null);
  };

  const handleCut = () => {
    if (contextMenu) {
      cutClip(trackId, clip.id, contextMenu.cutPosition);
      setContextMenu(null);
    }
  };

  const handleDeleteFromMenu = () => {
    removeClip(trackId, clip.id);
    setContextMenu(null);
  };

  // Chiudi menu contestuale quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

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
  
  // Ottieni il volume della traccia e della clip
  const track = tracks.find(t => t.id === trackId);
  const trackVolume = track?.volume || 1.0;
  const clipVolume = clip.volume ?? 1.0; // Volume specifico della clip, default 1.0
  
  // Calcola il moltiplicatore del fade in/out basato sul tempo corrente
  const calculateFadeMultiplier = (): number => {
    if (!shouldBeActive) return 1.0; // Non in riproduzione, volume normale

    const timeInClip = currentTime - clip.startTime;
    const clipDuration = clip.endTime - clip.startTime;

    let fadeMultiplier = 1.0;

    // FADE IN - all'inizio della clip
    if (clip.fadeIn && clip.fadeIn > 0 && timeInClip < clip.fadeIn) {
      fadeMultiplier = Math.min(1.0, timeInClip / clip.fadeIn); // 0.0 → 1.0
    }

    // FADE OUT - alla fine della clip
    if (clip.fadeOut && clip.fadeOut > 0) {
      const fadeOutStartTime = clipDuration - clip.fadeOut;
      if (timeInClip >= fadeOutStartTime) {
        const fadeOutProgress = (timeInClip - fadeOutStartTime) / clip.fadeOut;
        fadeMultiplier = Math.max(0.0, 1.0 - fadeOutProgress); // 1.0 → 0.0
      }
    }

    return fadeMultiplier;
  };

  const fadeMultiplier = calculateFadeMultiplier();
  const finalVolume = clipVolume * trackVolume * fadeMultiplier; // Volume finale = clip * traccia * fade
  
  // Riferimenti ai player YouTube per aggiornare il volume
  const previewPlayerRef = useRef<any>(null);
  const activePlayerRef = useRef<any>(null);
  
  // Rileva loop restart e riavvia i video
  useEffect(() => {
    if (!shouldBeActive || loopRestartCount === 0) return;

    // C'è stato un loop restart, riavvia il video YouTube
    if (activePlayerRef.current && activePlayerRef.current.seekTo) {
      try {
        const timeInClip = currentTime - clip.startTime;
        const videoTime = (clip.clipStart || 0) + timeInClip;
        
        activePlayerRef.current.seekTo(videoTime, true);
        console.log('🔄 Resyncing YouTube player after loop restart - Clip:', clip.id, 'VideoTime:', videoTime.toFixed(2), 's');
      } catch (e) {
        console.warn('Could not resync player:', e);
      }
    }
  }, [loopRestartCount, shouldBeActive]);

  // Aggiorna il volume quando cambia (traccia, clip o fade) - OGNI FRAME durante il fade
  useEffect(() => {
    if (!shouldBeActive) return; // Aggiorna solo quando la clip è attiva

    const volumePercent = Math.round(finalVolume * 100);
    
    if (activePlayerRef.current && activePlayerRef.current.setVolume) {
      try {
        activePlayerRef.current.setVolume(volumePercent);
        
        // Log solo quando c'è fade attivo (per non intasare la console)
        if (fadeMultiplier < 0.99) {
          console.log('🔊 Fade active - Clip', clip.id, '- Volume:', volumePercent, '% (multiplier:', Math.round(fadeMultiplier * 100), '%)');
        }
      } catch (e) {
        console.warn('Could not set volume:', e);
      }
    }
  }, [finalVolume, fadeMultiplier, clip.id, shouldBeActive]);

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
        onContextMenu={handleContextMenu}
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

        {/* Header con titolo, edit e delete */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 px-2 py-1 flex items-center justify-between z-10">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <Music size={10} className="flex-shrink-0" />
            <span className="text-xs font-medium truncate">{clip.title || 'Untitled'}</span>
            {clip.volume !== undefined && clip.volume !== 1.0 && (
              <span className="text-xs bg-white/20 px-1 rounded text-white">
                {Math.round(clip.volume * 100)}%
              </span>
            )}
            {(clip.fadeIn !== undefined && clip.fadeIn > 0) || (clip.fadeOut !== undefined && clip.fadeOut > 0) ? (
              <span className="text-xs bg-orange-500/80 px-1 rounded text-white">
                Fade
              </span>
            ) : null}
          </div>
          
          <div className="flex items-center gap-1">
            {/* Edit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowInfo(true);
              }}
              className="flex-shrink-0 hover:bg-blue-500 p-0.5 rounded transition-colors"
              title="Modifica Clip"
            >
              <Settings size={12} />
            </button>
            
            {/* Delete Button */}
            <button
              onClick={handleDelete}
              className="flex-shrink-0 hover:bg-red-500 p-0.5 rounded transition-colors"
              title="Elimina Clip"
            >
              <X size={12} />
            </button>
          </div>
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
                  onReady={(event) => {
                    // Salva il riferimento al player e applica il volume
                    previewPlayerRef.current = event.target;
                    event.target.setVolume(finalVolume * 100);
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
                    onReady={(event) => {
                      // Salva il riferimento al player attivo e applica il volume CON fade
                      activePlayerRef.current = event.target;
                      const volumePercent = Math.round(finalVolume * 100);
                      event.target.setVolume(volumePercent);
                      event.target.unMute(); // Assicurati che non sia mutato
                      console.log('🎬 YouTube player ready - Clip:', clip.id, '- Volume:', volumePercent, '% (Fade multiplier:', Math.round(fadeMultiplier * 100), '%)');
                    }}
                  />
                  
                  {/* Indicatori Fade In/Out */}
                  {fadeMultiplier < 1.0 && (
                    <div className="absolute top-2 left-2 bg-purple-600/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10 pointer-events-none">
                      🔊 Vol: {Math.round(fadeMultiplier * 100)}%
                      {clip.fadeIn && clip.fadeIn > 0 && (currentTime - clip.startTime) < clip.fadeIn && ' (Fade In)'}
                      {clip.fadeOut && clip.fadeOut > 0 && (currentTime - clip.startTime) >= (clip.endTime - clip.startTime - clip.fadeOut) && ' (Fade Out)'}
                    </div>
                  )}
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
        
        {/* Visualizzazione grafica Fade In/Out */}
        <svg 
          className="absolute inset-0 pointer-events-none z-15" 
          style={{ top: '24px' }}
          preserveAspectRatio="none"
        >
          {/* Fade In - Rampa che sale da sinistra */}
          {clip.fadeIn && clip.fadeIn > 0 && (
            <g>
              {/* Area del fade in con gradiente */}
              <defs>
                <linearGradient id={`fadeInGradient-${clip.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 0.1 }} />
                </linearGradient>
              </defs>
              
              {/* Area riempita del fade in */}
              <polygon
                points={`0,100 ${(clip.fadeIn / clipDuration) * 100},0 ${(clip.fadeIn / clipDuration) * 100},100`}
                fill={`url(#fadeInGradient-${clip.id})`}
                vectorEffect="non-scaling-stroke"
              />
              
              {/* Linea del fade in */}
              <line
                x1="0%"
                y1="100%"
                x2={`${(clip.fadeIn / clipDuration) * 100}%`}
                y2="0%"
                stroke="#f59e0b"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              
              {/* Etichetta Fade In */}
              <text
                x="2%"
                y="95%"
                fill="#f59e0b"
                fontSize="10"
                fontWeight="bold"
              >
                IN ↗
              </text>
            </g>
          )}
          
          {/* Fade Out - Rampa che scende a destra */}
          {clip.fadeOut && clip.fadeOut > 0 && (
            <g>
              {/* Area del fade out con gradiente */}
              <defs>
                <linearGradient id={`fadeOutGradient-${clip.id}`} x1="100%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 0.1 }} />
                  <stop offset="100%" style={{ stopColor: '#ef4444', stopOpacity: 0.3 }} />
                </linearGradient>
              </defs>
              
              {/* Area riempita del fade out */}
              <polygon
                points={`${100 - (clip.fadeOut / clipDuration) * 100},0 100,100 ${100 - (clip.fadeOut / clipDuration) * 100},100`}
                fill={`url(#fadeOutGradient-${clip.id})`}
                vectorEffect="non-scaling-stroke"
              />
              
              {/* Linea del fade out */}
              <line
                x1={`${100 - (clip.fadeOut / clipDuration) * 100}%`}
                y1="0%"
                x2="100%"
                y2="100%"
                stroke="#ef4444"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              
              {/* Etichetta Fade Out */}
              <text
                x="96%"
                y="95%"
                fill="#ef4444"
                fontSize="10"
                fontWeight="bold"
                textAnchor="end"
              >
                ↘ OUT
              </text>
            </g>
          )}
        </svg>

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

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed bg-gray-800 border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-[100]"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
              minWidth: '200px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu Items */}
            <div className="py-1">
              {/* Copy */}
              <button
                onClick={handleCopy}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-3 transition-colors"
              >
                <Copy size={16} className="text-blue-400" />
                <span>Copia</span>
                <span className="ml-auto text-xs text-gray-500">Ctrl+C</span>
              </button>

              {/* Paste */}
              <button
                onClick={handlePaste}
                disabled={!clipboardClip}
                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 transition-colors ${
                  clipboardClip ? 'hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <Clipboard size={16} className="text-green-400" />
                <span>Incolla</span>
                <span className="ml-auto text-xs text-gray-500">Ctrl+V</span>
              </button>

              <div className="h-px bg-gray-700 my-1" />

              {/* Cut */}
              <button
                onClick={handleCut}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-3 transition-colors"
              >
                <Scissors size={16} className="text-purple-400" />
                <div className="flex-1">
                  <div>Taglia qui</div>
                  <div className="text-xs text-gray-500">
                    @ {contextMenu.cutPosition.toFixed(2)}s
                  </div>
                </div>
              </button>

              <div className="h-px bg-gray-700 my-1" />

              {/* Delete */}
              <button
                onClick={handleDeleteFromMenu}
                className="w-full px-4 py-2 text-left text-sm hover:bg-red-900/50 flex items-center gap-3 transition-colors text-red-400"
              >
                <Trash2 size={16} />
                <span>Elimina</span>
                <span className="ml-auto text-xs text-gray-500">Del</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Clip;

