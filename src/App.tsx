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
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              YouTube DAW
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Digital Audio Workstation - Crea, mixa e produce con YouTube
            </p>
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

