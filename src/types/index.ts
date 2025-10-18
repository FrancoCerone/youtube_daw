// Tipi per le clip audio
export interface Clip {
  id: number;
  url: string;
  title: string;
  startTime: number;
  endTime: number;
  clipStart: number;
  clipEnd: number;
}

// Tipi per le tracce
export interface Track {
  id: number;
  name: string;
  clips: Clip[];
}

// Tipi per lo stato del DAW
export interface DawState {
  tracks: Track[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playheadPosition: number;
}

// Tipi per le azioni dello store
export interface DawActions {
  addClip: (trackId: number, clip: Omit<Clip, 'id'>) => void;
  updateClip: (trackId: number, clipId: number, updates: Partial<Clip>) => void;
  removeClip: (trackId: number, clipId: number) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setCurrentTime: (time: number) => void;
  setPlayheadPosition: (position: number) => void;
  saveSession: () => void;
  loadSession: () => void;
}

// Store completo (state + actions)
export type DawStore = DawState & DawActions;

