# 🏗️ Architettura YouTube DAW

## 📐 Struttura Visuale

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER                                │
│  YouTube DAW - Digital Audio Workstation                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   TRANSPORT CONTROLS                         │
│  ▶ ■ ⟲     00:45     💾 Save   📂 Load                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       TIMELINE                               │
│  0:00    0:10    0:20    0:30    0:40    0:50    1:00      │
│    |      |       |       |       |       |       |         │
│              ▼ [PLAYHEAD]                                    │
└─────────────────────────────────────────────────────────────┘

┌────────────┬────────────────────────────────────────────────┐
│  Track 1   │  [CLIP 1]      [CLIP 2]                       │
│            │                                                │
│ [+ YouTube]│                                                │
└────────────┴────────────────────────────────────────────────┘

┌────────────┬────────────────────────────────────────────────┐
│  Track 2   │        [CLIP 3]                               │
│            │                                                │
│ [+ YouTube]│                                                │
└────────────┴────────────────────────────────────────────────┘

┌────────────┬────────────────────────────────────────────────┐
│  Track 3   │                    [CLIP 4]                   │
│            │                                                │
│ [+ YouTube]│                                                │
└────────────┴────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        FOOTER                                │
│  YouTube DAW - Drag & drop clips, trim audio, mix tracks    │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Flusso Dati (Data Flow)

```
┌─────────────────┐
│   User Action   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Component     │◄──────── Props
│  (Track.jsx)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  dawStore.js    │◄──────── Zustand Actions
│  (State)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Re-render      │
│  Components     │
└─────────────────┘
```

## 📦 Gerarchia Componenti

```
App.jsx
│
├── DndProvider (react-dnd)
│   │
│   ├── Header
│   │   └── Title + Description
│   │
│   ├── TransportControls
│   │   ├── Play/Pause Button
│   │   ├── Stop Button
│   │   ├── Reset Button
│   │   ├── Time Display
│   │   ├── Save Button
│   │   └── Load Button
│   │
│   ├── Timeline
│   │   ├── Time Markers (0:00, 0:10, ...)
│   │   └── Playhead
│   │
│   ├── Track (x3)
│   │   ├── Track Header
│   │   │   ├── Track Name
│   │   │   └── Add YouTube Button
│   │   │       └── YouTube Form (conditional)
│   │   │           ├── URL Input
│   │   │           ├── Trim Start Input
│   │   │           ├── Trim End Input
│   │   │           └── Add Clip Button
│   │   │
│   │   └── Track Timeline Area
│   │       ├── Grid Lines
│   │       └── Clip[] (array)
│   │           ├── Clip Container (draggable)
│   │           ├── Title + Icon
│   │           ├── Delete Button
│   │           ├── Waveform Simulation
│   │           └── ClipInfo Modal (on double-click)
│   │               ├── Title Display
│   │               ├── Trim Start Input
│   │               ├── Trim End Input
│   │               ├── Duration Display
│   │               ├── Position Display
│   │               └── Save/Cancel Buttons
│   │
│   ├── EmptyState (if no clips)
│   │   ├── Welcome Message
│   │   ├── Instructions Cards
│   │   └── Example URLs
│   │
│   ├── PlayerManager (hidden)
│   │   └── ReactPlayer[] (one per clip)
│   │
│   └── Footer
│       └── Info Text
```

## 🗃️ Store Structure (Zustand)

```javascript
{
  tracks: [
    {
      id: 1,
      name: "Track 1",
      clips: [
        {
          id: 1234567890,
          url: "https://youtube.com/...",
          title: "YouTube Clip",
          startTime: 0,      // Position on timeline
          endTime: 30,       // End position on timeline
          clipStart: 5,      // Trim start in source video
          clipEnd: 35        // Trim end in source video
        }
      ]
    },
    // Track 2 & 3...
  ],
  
  isPlaying: false,
  currentTime: 0,
  duration: 120,
  playheadPosition: 0,
  
  // Actions
  addClip: (trackId, clip) => {},
  updateClip: (trackId, clipId, updates) => {},
  removeClip: (trackId, clipId) => {},
  play: () => {},
  pause: () => {},
  stop: () => {},
  setCurrentTime: (time) => {},
  setPlayheadPosition: (position) => {},
  saveSession: () => {},
  loadSession: () => {}
}
```

## 🎬 Ciclo di Vita Riproduzione

```
1. User clicks PLAY
   │
   ▼
2. useDawStore.play() → isPlaying = true
   │
   ▼
3. PlayerManager useEffect triggered
   │
   ├─► requestAnimationFrame loop starts
   │   │
   │   ├─► Calculate elapsed time
   │   │
   │   ├─► Update currentTime in store
   │   │
   │   ├─► For each track & clip:
   │   │   │
   │   │   ├─► Check if currentTime in clip range
   │   │   │
   │   │   ├─► If YES:
   │   │   │   ├─► Calculate offset in clip
   │   │   │   ├─► Seek player to clipStart + offset
   │   │   │   └─► Play player
   │   │   │
   │   │   └─► If NO:
   │   │       └─► Pause player
   │   │
   │   └─► Loop (next frame)
   │
   └─► Playhead component re-renders
       └─► Position updated via CSS left: ${percentage}%
```

## 🔌 Integrazioni Esterne

```
┌─────────────────┐
│  YouTube API    │
│  (react-player) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│ PlayerManager   │──────┤ Web Audio API    │
│                 │      │ (browser native) │
└─────────────────┘      └──────────────────┘
         │
         ▼
┌─────────────────┐
│  Audio Output   │
│  (speakers)     │
└─────────────────┘
```

## 💾 Persistenza Dati

```
┌──────────────┐         ┌─────────────────┐
│ dawStore.js  │────────▶│ localStorage    │
│              │         │ 'dawSession'    │
│ saveSession()│         │                 │
└──────────────┘         └─────────────────┘
                                │
                                │
┌──────────────┐                │
│ dawStore.js  │◄───────────────┘
│              │
│ loadSession()│
└──────────────┘
```

## 🎨 Styling Architecture

```
┌─────────────────┐
│   TailwindCSS   │
│   (Utility)     │
└────────┬────────┘
         │
         ├─► Base Styles (index.css)
         │   ├─► Reset
         │   ├─► Typography
         │   └─► Colors
         │
         ├─► Component Classes
         │   ├─► bg-gray-900
         │   ├─► rounded-lg
         │   ├─► shadow-xl
         │   └─► transition-colors
         │
         └─► Custom Gradients
             └─► bg-gradient-to-r from-blue-600 to-purple-600
```

## 🎭 Event Handling

```
User Interaction Flow:

1. ADD CLIP
   Click "Add YouTube"
   └─► setShowInput(true)
       └─► Form appears
           └─► User fills URL + trim
               └─► Click "Add Clip"
                   └─► addClip(trackId, clipData)
                       └─► Store updated
                           └─► Track re-renders
                               └─► New Clip appears

2. DRAG CLIP
   Mouse down on clip
   └─► useDrag hook activated
       └─► Item data prepared
           └─► Drag visual feedback
               └─► Drop on track timeline
                   └─► useDrop hook receives
                       └─► Calculate new position
                           └─► updateClip(trackId, clipId, { startTime })
                               └─► Clip position updated

3. DOUBLE-CLICK CLIP
   Double-click
   └─► handleDoubleClick()
       └─► setShowInfo(true)
           └─► ClipInfo modal opens
               └─► User edits trim
                   └─► Click "Salva"
                       └─► onUpdate(updates)
                           └─► updateClip()
                               └─► Modal closes

4. PLAY
   Click Play button
   └─► play()
       └─► isPlaying = true
           └─► PlayerManager useEffect
               └─► requestAnimationFrame loop
                   └─► Players synchronized
                       └─► Audio plays
```

## 🧩 Module Dependencies

```
main.jsx
  │
  └─► App.jsx
       │
       ├─► store/dawStore.js (Zustand)
       │
       ├─► components/TransportControls.jsx
       │    └─► lucide-react (icons)
       │
       ├─► components/Timeline.jsx
       │
       ├─► components/Track.jsx
       │    ├─► framer-motion
       │    └─► components/Clip.jsx
       │         ├─► react-dnd
       │         └─► components/ClipInfo.jsx
       │
       ├─► components/EmptyState.jsx
       │    └─► framer-motion
       │
       └─► components/PlayerManager.jsx
            └─► react-player
```

## 🔐 Type Safety

Attualmente JavaScript puro, ma struttura pronta per TypeScript:

```typescript
// Possibili tipi futuri

interface Clip {
  id: number;
  url: string;
  title: string;
  startTime: number;
  endTime: number;
  clipStart: number;
  clipEnd: number;
}

interface Track {
  id: number;
  name: string;
  clips: Clip[];
}

interface DawState {
  tracks: Track[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playheadPosition: number;
}

interface DawActions {
  addClip: (trackId: number, clip: Omit<Clip, 'id'>) => void;
  updateClip: (trackId: number, clipId: number, updates: Partial<Clip>) => void;
  removeClip: (trackId: number, clipId: number) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setCurrentTime: (time: number) => void;
  saveSession: () => void;
  loadSession: () => void;
}
```

## 📊 Performance Considerations

### Optimization Points:
1. **React.memo** - Per componenti che non cambiano spesso
2. **useMemo** - Per calcoli pesanti (es: clipDuration)
3. **useCallback** - Per handler passati a child components
4. **Virtual scrolling** - Se il numero di tracce diventa grande
5. **Web Workers** - Per audio processing futuro

### Current Bottlenecks:
- Rendering di molte clip simultanee
- requestAnimationFrame loop continuo
- Multiple ReactPlayer instances

---

**Architettura modulare, scalabile e manutenibile!** 🏗️

