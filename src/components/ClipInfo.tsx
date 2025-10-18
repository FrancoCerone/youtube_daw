import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Scissors } from 'lucide-react';
import { Clip } from '../types';

interface ClipInfoProps {
  clip: Clip;
  onClose: () => void;
  onUpdate: (updates: Partial<Clip>) => void;
}

const ClipInfo: React.FC<ClipInfoProps> = ({ clip, onClose, onUpdate }) => {
  const [startTime, setStartTime] = React.useState(clip.clipStart || 0);
  const [endTime, setEndTime] = React.useState(clip.clipEnd || 30);

  const handleSave = () => {
    const clipDuration = endTime - startTime;
    onUpdate({
      clipStart: startTime,
      clipEnd: endTime,
      endTime: clip.startTime + clipDuration,
    });
    onClose();
  };

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

          <div className="space-y-4">
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

            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Trim Start (secondi)
              </label>
              <input
                type="number"
                value={startTime}
                onChange={(e) => setStartTime(parseFloat(e.target.value))}
                min="0"
                step="0.1"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Trim End (secondi)
              </label>
              <input
                type="number"
                value={endTime}
                onChange={(e) => setEndTime(parseFloat(e.target.value))}
                min={startTime}
                step="0.1"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="text-xs text-gray-400 space-y-1">
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
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
              >
                Salva
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ClipInfo;

