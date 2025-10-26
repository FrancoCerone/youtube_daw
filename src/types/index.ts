// Tipi per le clip audio
export interface Clip {
  id: number;
  url: string;
  title: string;
  startTime: number;
  endTime: number;
  clipStart: number;
  clipEnd: number;
  volume?: number; // Volume specifico della clip (0-1), se non impostato usa il volume della traccia
  playbackSpeed?: number; // Velocità di riproduzione (0.5-2.0)
  fadeIn?: number; // Fade in in secondi (0-10)
  fadeOut?: number; // Fade out in secondi (0-10)
}

// Tipi per le tracce
export interface Track {
  id: number;
  name: string;
  clips: Clip[];
  volume: number; // Volume della traccia (0-1)
}

// Tipi per lo stato del DAW
export interface DawState {
  tracks: Track[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playheadPosition: number;
  timelineZoom: number;
  timelineScroll: number;
  clipboardClip: Omit<Clip, 'id'> | null; // Clip copiata negli appunti
}

// Tipi per le azioni dello store
export interface DawActions {
  addClip: (trackId: number, clip: Omit<Clip, 'id'>) => void;
  updateClip: (trackId: number, clipId: number, updates: Partial<Clip>) => void;
  removeClip: (trackId: number, clipId: number) => void;
  copyClip: (trackId: number, clipId: number) => void;
  pasteClip: (trackId: number, position?: number) => void;
  cutClip: (trackId: number, clipId: number, cutPosition: number) => void;
  setTrackVolume: (trackId: number, volume: number) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setCurrentTime: (time: number) => void;
  setPlayheadPosition: (position: number) => void;
  setTimelineZoom: (zoom: number) => void;
  setTimelineScroll: (scroll: number) => void;
  resetTimelineView: () => void;
  saveSession: () => void;
  loadSession: () => void;
}

// Store completo (state + actions)
export type DawStore = DawState & DawActions;

