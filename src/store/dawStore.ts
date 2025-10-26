import { create } from 'zustand';
import { DawStore, Track } from '../types';

const useDawStore = create<DawStore>((set, get) => ({
  // Stato delle tracce
  tracks: [
    { id: 1, name: 'Track 1', clips: [], volume: 1.0 },
    { id: 2, name: 'Track 2', clips: [], volume: 1.0 },
    { id: 3, name: 'Track 3', clips: [], volume: 1.0 },
  ],

  // Stato del transport
  isPlaying: false,
  currentTime: 0,
  duration: 120, // durata totale timeline in secondi
  playheadPosition: 0,
  
  // Stato zoom e scroll timeline
  timelineZoom: 1, // fattore di zoom (1 = normale, >1 = zoom in, <1 = zoom out)
  timelineScroll: 0, // posizione di scroll orizzontale in pixel
  
  // Clipboard per copia/incolla
  clipboardClip: null,

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

  // Copia clip negli appunti
  copyClip: (trackId, clipId) => {
    const state = get();
    const track = state.tracks.find(t => t.id === trackId);
    const clip = track?.clips.find(c => c.id === clipId);
    
    if (clip) {
      const { id, ...clipWithoutId } = clip;
      set({ clipboardClip: clipWithoutId });
    }
  },

  // Incolla clip dalla clipboard
  pasteClip: (trackId, position) => {
    const state = get();
    if (!state.clipboardClip) return;

    const pastePosition = position ?? state.currentTime;
    const clipDuration = state.clipboardClip.endTime - state.clipboardClip.startTime;

    set((state) => ({
      tracks: state.tracks.map(track =>
        track.id === trackId
          ? {
              ...track,
              clips: [
                ...track.clips,
                {
                  ...state.clipboardClip!,
                  id: Date.now(),
                  startTime: pastePosition,
                  endTime: pastePosition + clipDuration,
                }
              ]
            }
          : track
      )
    }));
  },

  // Taglia clip in due parti nel punto specificato
  cutClip: (trackId, clipId, cutPosition) => set((state) => {
    const track = state.tracks.find(t => t.id === trackId);
    const clip = track?.clips.find(c => c.id === clipId);
    
    if (!clip) return state;

    // Calcola il tempo relativo nella clip
    const timeInClip = cutPosition - clip.startTime;
    const videoTimeAtCut = clip.clipStart + timeInClip;

    // Clip 1: dalla partenza al punto di taglio
    const clip1 = {
      ...clip,
      id: clip.id,
      endTime: cutPosition,
      clipEnd: videoTimeAtCut,
    };

    // Clip 2: dal punto di taglio alla fine
    const clip2 = {
      ...clip,
      id: Date.now(),
      startTime: cutPosition,
      clipStart: videoTimeAtCut,
    };

    return {
      tracks: state.tracks.map(track =>
        track.id === trackId
          ? {
              ...track,
              clips: track.clips.map(c => c.id === clipId ? clip1 : c).concat([clip2])
            }
          : track
      )
    };
  }),

  setTrackVolume: (trackId, volume) => set((state) => ({
    tracks: state.tracks.map(track =>
      track.id === trackId
        ? { ...track, volume: Math.max(0, Math.min(1, volume)) }
        : track
    )
  })),

  play: () => set({ isPlaying: true }),
  
  pause: () => set({ isPlaying: false }),
  
  stop: () => set({ isPlaying: false, currentTime: 0, playheadPosition: 0 }),

  setCurrentTime: (time: number) => set({ currentTime: time }),

  setPlayheadPosition: (position: number) => set({ playheadPosition: position }),

  // Azioni zoom e scroll timeline
  setTimelineZoom: (zoom: number) => set({ timelineZoom: Math.max(0.1, Math.min(10, zoom)) }),
  
  setTimelineScroll: (scroll: number) => set({ timelineScroll: Math.max(0, scroll) }),
  
  resetTimelineView: () => set({ timelineZoom: 1, timelineScroll: 0 }),

  // Salva sessione in localStorage
  saveSession: () => {
    const state = get();
    localStorage.setItem('dawSession', JSON.stringify({
      tracks: state.tracks,
      duration: state.duration,
      timelineZoom: state.timelineZoom,
      timelineScroll: state.timelineScroll
    }));
  },

  // Carica sessione da localStorage
  loadSession: () => {
    const saved = localStorage.getItem('dawSession');
    if (saved) {
      const { tracks, duration, timelineZoom, timelineScroll } = JSON.parse(saved) as { 
        tracks: Track[]; 
        duration: number;
        timelineZoom?: number;
        timelineScroll?: number;
      };
      set({ 
        tracks, 
        duration,
        timelineZoom: timelineZoom || 1,
        timelineScroll: timelineScroll || 0
      });
    }
  }
}));

export default useDawStore;

