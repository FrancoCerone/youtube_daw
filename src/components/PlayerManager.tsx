import React, { useEffect, useRef } from 'react';
import useDawStore from '../store/dawStore';
import { Clip } from '../types';

const PlayerManager: React.FC = () => {
  const { tracks, isPlaying, currentTime, setCurrentTime } = useDawStore();
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBuffersRef = useRef<Record<number, AudioBuffer>>({});
  const audioSourcesRef = useRef<Record<number, AudioBufferSourceNode>>({});
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const playStartTimeRef = useRef<number>(0);

  // Inizializza AudioContext
  useEffect(() => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('AudioContext initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Carica audio da URL (funziona con file locali o CORS-enabled URLs)
  const loadAudio = async (clip: Clip) => {
    if (audioBuffersRef.current[clip.id] || !audioContextRef.current) return;
    
    try {
      // Per ora usiamo un tone di test
      // In futuro: const response = await fetch(clip.url);
      // const arrayBuffer = await response.arrayBuffer();
      // const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      
      // Crea un buffer audio di test (tone beep)
      const duration = (clip.clipEnd || 30) - (clip.clipStart || 0);
      const sampleRate = audioContextRef.current.sampleRate;
      const buffer = audioContextRef.current.createBuffer(2, duration * sampleRate, sampleRate);
      
      // Genera un tono di test (440 Hz = La)
      const frequency = 440 + (clip.id % 200); // Frequenza diversa per ogni clip
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const data = buffer.getChannelData(channel);
        for (let i = 0; i < buffer.length; i++) {
          data[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.3;
        }
      }
      
      audioBuffersRef.current[clip.id] = buffer;
    } catch (error) {
      console.error('Error loading audio for clip', clip.id, error);
    }
  };

  // Carica audio per tutte le clip
  useEffect(() => {
    tracks.forEach(track => {
      track.clips.forEach(clip => {
        loadAudio(clip);
      });
    });
  }, [tracks]);

  // Gestione riproduzione con metodo più semplice e affidabile
  useEffect(() => {
    console.log('PlayerManager effect triggered. isPlaying:', isPlaying);

    if (isPlaying) {
      // Salva il tempo di inizio della riproduzione
      playStartTimeRef.current = performance.now() / 1000 - currentTime;
      
      console.log('Starting playback. currentTime:', currentTime);
      
      // Aggiorna il tempo corrente con animazione fluida usando performance.now()
      const updateTime = () => {
        const elapsed = performance.now() / 1000 - playStartTimeRef.current;
        setCurrentTime(elapsed);
        animationFrameRef.current = requestAnimationFrame(updateTime);
      };
      updateTime();
      
    } else {
      // Ferma l'aggiornamento del tempo
      console.log('Stopping playback');
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  return (
    <div className="fixed bottom-2 right-2 bg-gray-900/90 text-white p-3 rounded-lg text-xs z-50 border border-gray-700 shadow-lg">
      <div className="font-bold text-blue-400 mb-2">Player Manager</div>
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
        <span className="font-semibold">Status: {isPlaying ? '▶️ Playing' : '⏸️ Stopped'}</span>
      </div>
      <div className="text-gray-300 mb-1">
        ⏱️ Time: <span className="font-mono text-green-400">{currentTime.toFixed(2)}s</span>
      </div>
      <div className="text-gray-400">
        🎵 Clips: {tracks.reduce((count, t) => count + t.clips.length, 0)}
      </div>
    </div>
  );
};

export default PlayerManager;

