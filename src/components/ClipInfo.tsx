import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Scissors, Volume2, Gauge, TrendingUp, TrendingDown } from 'lucide-react';
import { Clip } from '../types';

interface ClipInfoProps {
  clip: Clip;
  onClose: () => void;
  onUpdate: (updates: Partial<Clip>) => void;
}

const ClipInfo: React.FC<ClipInfoProps> = ({ clip, onClose, onUpdate }) => {
  const [startTime, setStartTime] = React.useState(clip.clipStart || 0);
  const [endTime, setEndTime] = React.useState(clip.clipEnd || 30);
  const [volume, setVolume] = React.useState(clip.volume ?? 1.0);
  const [playbackSpeed, setPlaybackSpeed] = React.useState(clip.playbackSpeed ?? 1.0);
  const [fadeIn, setFadeIn] = React.useState(clip.fadeIn ?? 0);
  const [fadeOut, setFadeOut] = React.useState(clip.fadeOut ?? 0);

  // Funzione per aggiornare la clip con i valori correnti
  const updateClipNow = React.useCallback(() => {
    const clipDuration = endTime - startTime;
    onUpdate({
      clipStart: startTime,
      clipEnd: endTime,
      endTime: clip.startTime + clipDuration, // Aggiorna la fine sulla timeline
      volume: volume,
      fadeIn: fadeIn,
      fadeOut: fadeOut,
    });
  }, [startTime, endTime, volume, fadeIn, fadeOut, clip.startTime, onUpdate]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Scissors className="text-blue-400" size={24} />
              Modifica Clip
            </h3>
            <button
              onClick={onClose}
              className="hover:bg-gray-700 p-2 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Titolo */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                <Clock size={16} />
                Titolo
              </label>
              <input
                type="text"
                value={clip.title}
                disabled
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Trim Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Trim Start (s)
                </label>
                <input
                  type="number"
                  value={startTime}
                  onChange={(e) => {
                    const newStartTime = parseFloat(e.target.value);
                    setStartTime(newStartTime);
                    // Aggiorna immediatamente con i nuovi valori
                    setTimeout(() => {
                      const clipDuration = endTime - newStartTime;
                      onUpdate({
                        clipStart: newStartTime,
                        clipEnd: endTime,
                        endTime: clip.startTime + clipDuration,
                        volume: volume,
                        fadeIn: fadeIn,
                        fadeOut: fadeOut,
                      });
                    }, 0);
                  }}
                  min="0"
                  step="0.1"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Trim End (s)
                </label>
                <input
                  type="number"
                  value={endTime}
                  onChange={(e) => {
                    const newEndTime = parseFloat(e.target.value);
                    setEndTime(newEndTime);
                    // Aggiorna immediatamente con i nuovi valori
                    setTimeout(() => {
                      const clipDuration = newEndTime - startTime;
                      onUpdate({
                        clipStart: startTime,
                        clipEnd: newEndTime,
                        endTime: clip.startTime + clipDuration,
                        volume: volume,
                        fadeIn: fadeIn,
                        fadeOut: fadeOut,
                      });
                    }, 0);
                  }}
                  min={startTime}
                  step="0.1"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Volume Control */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                <Volume2 size={16} />
                Volume Clip ({Math.round(volume * 100)}%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value);
                    setVolume(newVolume);
                    setTimeout(() => updateClipNow(), 10);
                  }}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
                  }}
                />
                <button
                  onClick={() => {
                    setVolume(1.0);
                    setTimeout(() => updateClipNow(), 10);
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Playback Speed - Disabled (YouTube API limitation) */}
            <div className="opacity-50 pointer-events-none">
              <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                <Gauge size={16} />
                Velocità (Non supportata da YouTube)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={1.0}
                  disabled
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-not-allowed"
                />
                <span className="text-xs text-gray-500">
                  YouTube API Limitation
                </span>
              </div>
            </div>

            {/* Fade Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                  <TrendingUp size={16} />
                  Fade In ({fadeIn}s)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={fadeIn}
                    onChange={(e) => {
                      const newFadeIn = parseFloat(e.target.value) || 0;
                      setFadeIn(newFadeIn);
                      setTimeout(() => updateClipNow(), 10);
                    }}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${fadeIn * 10}%, #374151 ${fadeIn * 10}%, #374151 100%)`
                    }}
                  />
                  <span className="text-xs text-gray-400 w-8">{fadeIn.toFixed(1)}s</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                  <TrendingDown size={16} />
                  Fade Out ({fadeOut}s)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={fadeOut}
                    onChange={(e) => {
                      const newFadeOut = parseFloat(e.target.value) || 0;
                      setFadeOut(newFadeOut);
                      setTimeout(() => updateClipNow(), 10);
                    }}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${fadeOut * 10}%, #374151 ${fadeOut * 10}%, #374151 100%)`
                    }}
                  />
                  <span className="text-xs text-gray-400 w-8">{fadeOut.toFixed(1)}s</span>
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="text-xs text-gray-400 space-y-2">
                <div className="flex justify-between">
                  <span>Durata clip:</span>
                  <span className="font-mono text-blue-400">
                    {(endTime - startTime).toFixed(1)}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Posizione timeline:</span>
                  <span className="font-mono text-purple-400">
                    {clip.startTime.toFixed(1)}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Volume clip:</span>
                  <span className="font-mono text-green-400">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                {(fadeIn > 0 || fadeOut > 0) && (
                  <div className="flex justify-between">
                    <span>Fade:</span>
                    <span className="font-mono text-yellow-400">
                      In: {fadeIn.toFixed(1)}s | Out: {fadeOut.toFixed(1)}s
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={onClose}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Chiudi
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ClipInfo;

