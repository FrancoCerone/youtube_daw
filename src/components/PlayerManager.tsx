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

  // Inizializza AudioContext
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
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

  // Gestione riproduzione
  useEffect(() => {
    if (!audioContextRef.current) return;

    if (isPlaying) {
      startTimeRef.current = audioContextRef.current.currentTime - currentTime;
      
      // Avvia la riproduzione di tutte le clip che devono suonare
      tracks.forEach(track => {
        track.clips.forEach(clip => {
          const buffer = audioBuffersRef.current[clip.id];
          if (!buffer || !audioContextRef.current) return;
          
          const clipStart = clip.startTime;
          const clipEnd = clip.endTime;
          
          // Calcola quando deve iniziare/finire nella timeline audio
          const startTime = audioContextRef.current.currentTime + (clipStart - currentTime);
          const duration = clipEnd - clipStart;
          
          if (startTime + duration > audioContextRef.current.currentTime) {
            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current.destination);
            
            const offset = Math.max(0, currentTime - clipStart);
            const when = Math.max(audioContextRef.current.currentTime, startTime);
            
            source.start(when, offset, duration - offset);
            audioSourcesRef.current[clip.id] = source;
          }
        });
      });
      
      // Aggiorna il tempo corrente
      const updateTime = () => {
        if (!audioContextRef.current || !startTimeRef.current) return;
        const elapsed = audioContextRef.current.currentTime - startTimeRef.current;
        setCurrentTime(elapsed);
        animationFrameRef.current = requestAnimationFrame(updateTime);
      };
      updateTime();
      
    } else {
      // Stop tutti i source
      Object.values(audioSourcesRef.current).forEach(source => {
        try {
          source.stop();
        } catch (e) {
          // Already stopped
        }
      });
      audioSourcesRef.current = {};
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, currentTime, tracks, setCurrentTime]);

  return (
    <div className="fixed bottom-2 right-2 bg-gray-900/90 text-white p-2 rounded-lg text-xs z-50">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
        <span>Audio: {isPlaying ? 'Playing' : 'Stopped'} | {currentTime.toFixed(1)}s</span>
      </div>
      <div className="text-gray-400 mt-1">
        {tracks.reduce((count, t) => count + t.clips.length, 0)} clips loaded
      </div>
    </div>
  );
};

export default PlayerManager;

