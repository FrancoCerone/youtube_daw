import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VolumeSliderProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  trackName: string;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({ 
  volume, 
  onVolumeChange, 
  trackName 
}) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  const handleMute = () => {
    onVolumeChange(volume > 0 ? 0 : 1);
  };

  const formatVolume = (vol: number): string => {
    return `${Math.round(vol * 100)}%`;
  };

  return (
    <div className="flex items-center gap-2">
      {/* Mute/Unmute Button */}
      <button
        onClick={handleMute}
        className={`p-1 rounded transition-colors ${
          volume > 0 
            ? 'text-gray-400 hover:text-white' 
            : 'text-red-400 hover:text-red-300'
        }`}
        title={volume > 0 ? 'Mute' : 'Unmute'}
      >
        {volume > 0 ? <Volume2 size={14} /> : <VolumeX size={14} />}
      </button>

      {/* Volume Slider */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleSliderChange}
          className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
          }}
        />
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 12px;
            width: 12px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 2px solid #1f2937;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          .slider::-moz-range-thumb {
            height: 12px;
            width: 12px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 2px solid #1f2937;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
        `}</style>
        
        {/* Volume Percentage */}
        <span className="text-xs text-gray-400 w-8 text-right">
          {formatVolume(volume)}
        </span>
      </div>
    </div>
  );
};

export default VolumeSlider;
