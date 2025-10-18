import { create } from 'zustand';

const useDawStore = create((set, get) => ({
  // Stato delle tracce
  tracks: [
    { id: 1, name: 'Track 1', clips: [] },
    { id: 2, name: 'Track 2', clips: [] },
    { id: 3, name: 'Track 3', clips: [] },
  ],

  // Stato del transport
  isPlaying: false,
  currentTime: 0,
  duration: 120, // durata totale timeline in secondi
  playheadPosition: 0,

  // Azioni
  addClip: (trackId, clip) => set((state) => ({
    tracks: state.tracks.map(track =>
      track.id === trackId
        ? { ...track, clips: [...track.clips, { ...clip, id: Date.now() }] }
        : track
    )
  })),

  updateClip: (trackId, clipId, updates) => set((state) => ({
    tracks: state.tracks.map(track =>
      track.id === trackId
        ? {
            ...track,
            clips: track.clips.map(clip =>
              clip.id === clipId ? { ...clip, ...updates } : clip
            )
          }
        : track
    )
  })),

  removeClip: (trackId, clipId) => set((state) => ({
    tracks: state.tracks.map(track =>
      track.id === trackId
        ? { ...track, clips: track.clips.filter(clip => clip.id !== clipId) }
        : track
    )
  })),

  play: () => set({ isPlaying: true }),
  
  pause: () => set({ isPlaying: false }),
  
  stop: () => set({ isPlaying: false, currentTime: 0, playheadPosition: 0 }),

  setCurrentTime: (time) => set({ currentTime: time }),

  setPlayheadPosition: (position) => set({ playheadPosition: position }),

  // Salva sessione in localStorage
  saveSession: () => {
    const state = get();
    localStorage.setItem('dawSession', JSON.stringify({
      tracks: state.tracks,
      duration: state.duration
    }));
  },

  // Carica sessione da localStorage
  loadSession: () => {
    const saved = localStorage.getItem('dawSession');
    if (saved) {
      const { tracks, duration } = JSON.parse(saved);
      set({ tracks, duration });
    }
  }
}));

export default useDawStore;

