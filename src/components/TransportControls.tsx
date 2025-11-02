import React from 'react';
import { Play, Pause, Square, RotateCcw, Save, FolderOpen, Repeat } from 'lucide-react';
import { motion } from 'framer-motion';
import useDawStore from '../store/dawStore';

const TransportControls: React.FC = () => {
  const { isPlaying, isLooping, currentTime, play, pause, stop, toggleLoop, saveSession, loadSession } = useDawStore();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900 border-b border-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isPlaying ? pause : play}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stop}
            className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors"
          >
            <Square size={20} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stop}
            className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors"
          >
            <RotateCcw size={20} />
          </motion.button>

          <div className="h-8 w-px bg-gray-700 mx-1" />

          {/* Loop Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLoop}
            className={`p-3 rounded-lg transition-colors ${
              isLooping 
                ? 'bg-orange-600 hover:bg-orange-700' 
                : 'bg-gray-700 hover:bg-gray-600'
            } text-white`}
            title={isLooping ? 'Loop Attivo' : 'Attiva Loop'}
          >
            <Repeat size={20} />
          </motion.button>
        </div>

        <div className="text-2xl font-mono bg-gray-800 px-6 py-2 rounded-lg">
          {formatTime(currentTime)}
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveSession}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Save size={18} />
            <span className="hidden sm:inline">Save</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadSession}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <FolderOpen size={18} />
            <span className="hidden sm:inline">Load</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TransportControls;

