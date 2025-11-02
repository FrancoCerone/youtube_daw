import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TransportControls from './components/TransportControls';
import Timeline from './components/Timeline';
import Track from './components/Track';
import EmptyState from './components/EmptyState';
import PlayerManager from './components/PlayerManager';
import useDawStore from './store/dawStore';

const App: React.FC = () => {
  const { tracks, loadSession } = useDawStore();

  useEffect(() => {
    // Carica la sessione salvata all'avvio
    loadSession();
  }, [loadSession]);

  // Controlla se ci sono clip in qualche traccia
  const hasClips = tracks.some(track => track.clips.length > 0);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-950 text-white">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 p-4">
          <div className="max-w-7xl mx-auto flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                YouTube DAW
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Digital Audio Workstation - Crea, mixa e produce con YouTube
              </p>
            </div>
            
            {/* Version Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">v1.0.3</span>
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 px-3 py-1 rounded-full">
                <span className="text-xs font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  BETA
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Transport Controls */}
        <TransportControls />

        {/* Timeline */}
        <Timeline />

        {/* Tracks */}
        <div className="flex-1 overflow-auto">
          {tracks.map((track) => (
            <Track key={track.id} track={track} />
          ))}
          
          {/* Empty State */}
          {!hasClips && <EmptyState />}
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 border-t border-gray-800 p-4 mt-8">
          <div className="max-w-7xl mx-auto text-center text-sm text-gray-400">
            <p>YouTube DAW - Drag & drop clips, trim audio, and mix tracks in real-time</p>
          </div>
        </footer>

        {/* Player Manager - gestisce l'aggiornamento del tempo */}
        <PlayerManager />
      </div>
    </DndProvider>
  );
};

export default App;

