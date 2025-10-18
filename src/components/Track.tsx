import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { motion } from 'framer-motion';
import { Youtube, Plus } from 'lucide-react';
import Clip from './Clip';
import useDawStore from '../store/dawStore';
import { Track as TrackType } from '../types';

interface TrackProps {
  track: TrackType;
}

interface DragItem {
  clipId: number;
  trackId: number;
  startTime: number;
  endTime: number;
}

interface DropPreview {
  startTime: number;
  endTime: number;
  clipDuration: number;
}

const Track: React.FC<TrackProps> = ({ track }) => {
  const { addClip, updateClip, removeClip, duration } = useDawStore();
  const [showInput, setShowInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [clipSettings, setClipSettings] = useState({
    startTime: 0,
    endTime: 30,
  });
  const [dropPreview, setDropPreview] = useState<DropPreview | null>(null);

  const [{ isOver, canDrop }, drop] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>({
    accept: 'CLIP',
    hover: (item, monitor) => {
      if (!monitor.isOver({ shallow: true })) {
        setDropPreview(null);
        return;
      }

      const offset = monitor.getClientOffset();
      if (offset) {
        const container = document.getElementById(`track-${track.id}`);
        if (container) {
          const rect = container.getBoundingClientRect();
          const x = offset.x - rect.left;
          const percentage = Math.max(0, Math.min(1, x / rect.width));
          const newStartTime = percentage * duration;
          const clipDuration = item.endTime - item.startTime;
          const newEndTime = Math.min(duration, newStartTime + clipDuration);
          
          setDropPreview({
            startTime: newStartTime,
            endTime: newEndTime,
            clipDuration: clipDuration,
          });
        }
      }
    },
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      setDropPreview(null);
      
      if (offset) {
        const container = document.getElementById(`track-${track.id}`);
        if (container) {
          const rect = container.getBoundingClientRect();
          const x = offset.x - rect.left;
          const percentage = Math.max(0, Math.min(1, x / rect.width));
          const newStartTime = percentage * duration;
          
          // Calcola la durata della clip per mantenere la stessa lunghezza
          const clipDuration = item.endTime - item.startTime;
          const newEndTime = Math.min(duration, newStartTime + clipDuration);
          
          // Se stiamo spostando la clip su una traccia diversa
          if (item.trackId !== track.id) {
            // Rimuovi dalla traccia originale
            const { tracks } = useDawStore.getState();
            const sourceTrack = tracks.find(t => t.id === item.trackId);
            const clipToMove = sourceTrack?.clips.find(c => c.id === item.clipId);
            
            if (clipToMove) {
              // Rimuovi dalla traccia originale
              removeClip(item.trackId, item.clipId);
              
              // Aggiungi alla nuova traccia
              addClip(track.id, {
                url: clipToMove.url,
                title: clipToMove.title,
                startTime: newStartTime,
                endTime: newEndTime,
                clipStart: clipToMove.clipStart,
                clipEnd: clipToMove.clipEnd,
              });
            }
          } else {
            // Stesso track, solo aggiorna la posizione
            updateClip(item.trackId, item.clipId, {
              startTime: newStartTime,
              endTime: newEndTime,
            });
          }
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleAddClip = () => {
    if (youtubeUrl) {
      const clipDuration = clipSettings.endTime - clipSettings.startTime;
      addClip(track.id, {
        url: youtubeUrl,
        title: `YouTube Clip`,
        startTime: 0,
        endTime: clipDuration,
        clipStart: clipSettings.startTime,
        clipEnd: clipSettings.endTime,
      });
      setYoutubeUrl('');
      setShowInput(false);
      setClipSettings({ startTime: 0, endTime: 30 });
    }
  };

  return (
    <div className="border-b border-gray-800">
      <div className="flex">
        {/* Track header */}
        <div className="w-48 bg-gray-900 border-r border-gray-800 p-4 flex flex-col gap-2">
          <h3 className="font-semibold text-sm">{track.name}</h3>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowInput(!showInput)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-xs flex items-center gap-2 justify-center transition-colors"
          >
            <Youtube size={14} />
            Add YouTube
          </motion.button>

          {showInput && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="YouTube URL"
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
              />
              
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Trim Start (s)</label>
                <input
                  type="number"
                  value={clipSettings.startTime}
                  onChange={(e) => setClipSettings({ ...clipSettings, startTime: parseFloat(e.target.value) })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Trim End (s)</label>
                <input
                  type="number"
                  value={clipSettings.endTime}
                  onChange={(e) => setClipSettings({ ...clipSettings, endTime: parseFloat(e.target.value) })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <button
                onClick={handleAddClip}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1 justify-center transition-colors"
              >
                <Plus size={12} />
                Add Clip
              </button>
            </motion.div>
          )}
        </div>

        {/* Track timeline area */}
        <div
          id={`track-${track.id}`}
          ref={drop}
          className={`flex-1 h-56 bg-gray-800 relative transition-all ${
            isOver ? 'bg-blue-900/30 ring-2 ring-blue-500' : ''
          }`}
        >
          {/* Grid lines */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: Math.ceil(duration / 10) }).map((_, i) => (
              <div
                key={i}
                className="flex-1 border-r border-gray-700/30"
              />
            ))}
          </div>

          {/* Clips */}
          {track.clips.map((clip) => (
            <Clip key={clip.id} clip={clip} trackId={track.id} />
          ))}

          {/* Drop Preview - mostra dove la clip verrà rilasciata */}
          {dropPreview && isOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-2 bottom-2 border-2 border-dashed border-green-400 bg-green-500/20 rounded-lg pointer-events-none z-30"
              style={{
                left: `${(dropPreview.startTime / duration) * 100}%`,
                width: `${(dropPreview.clipDuration / duration) * 100}%`,
                minWidth: '120px',
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-green-500/80 text-white text-xs px-2 py-1 rounded">
                  Drop qui
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Track;

