# YouTube DAW - Digital Audio Workstation

Una semplice **Digital Audio Workstation (DAW)** web-based che permette di creare, mixare e produrre musica utilizzando video di YouTube come sorgenti audio.

![React](https://img.shields.io/badge/React-19.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-cyan)

## 🎵 Funzionalità

- **3 Tracce Audio**: Layout timeline orizzontale con 3 tracce indipendenti
- **Import da YouTube**: Aggiungi clip audio direttamente da URL YouTube
- **Trim & Edit**: Imposta punto di inizio e fine per ogni clip
- **Drag & Drop**: Sposta le clip lungo la timeline con interazioni fluide
- **Riproduzione Sincronizzata**: Play, Pause, Stop e Reset con playhead animato
- **Salva/Carica Sessioni**: Persistenza in localStorage
- **UI Moderna**: Design minimale con TailwindCSS e animazioni Framer Motion

## 🚀 Installazione

```bash
# Clona il repository
cd youtube-daw

# Installa le dipendenze
npm install

# Avvia il dev server
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`

## 📦 Tecnologie Utilizzate

- **React 19** + **Vite** - Framework e build tool
- **TailwindCSS 4** - Styling moderno
- **Zustand** - State management
- **React DnD** - Drag and drop
- **Framer Motion** - Animazioni fluide
- **React Player** - Riproduzione YouTube
- **Lucide React** - Icone

## 🎯 Come Usare

1. **Aggiungi una clip**:
   - Clicca su "Add YouTube" in una traccia
   - Incolla l'URL di un video YouTube
   - Imposta i punti di trim (Start/End in secondi)
   - Clicca "Add Clip"

2. **Sposta le clip**:
   - Trascina le clip lungo la timeline
   - Posizionale dove vuoi nella composizione

3. **Riproduci**:
   - Usa i controlli Play/Pause/Stop
   - Il playhead rosso mostra la posizione corrente
   - Tutte le tracce vengono riprodotte sincronizzate

4. **Salva/Carica**:
   - "Save" salva la sessione corrente
   - "Load" ricarica l'ultima sessione salvata

## 📁 Struttura del Progetto

```
youtube-daw/
├── src/
│   ├── components/
│   │   ├── Clip.jsx              # Singola clip audio
│   │   ├── Track.jsx             # Traccia con controlli
│   │   ├── Timeline.jsx          # Timeline con marker temporali
│   │   ├── TransportControls.jsx # Controlli Play/Pause/Stop
│   │   └── PlayerManager.jsx     # Gestione player YouTube
│   ├── store/
│   │   └── dawStore.js           # Zustand store
│   ├── App.jsx                   # Componente principale
│   ├── index.css                 # Stili globali
│   └── main.jsx                  # Entry point
├── package.json
└── README.md
```

## 🎨 Design

L'interfaccia è progettata per essere:
- **Minimale**: Focus sul contenuto, senza distrazioni
- **Moderna**: Gradienti, ombre e animazioni smooth
- **Intuitiva**: Drag & drop naturale, controlli familiari
- **Responsive**: Adatta a diverse dimensioni dello schermo

## 🔧 Build per Produzione

```bash
npm run build
```

I file ottimizzati saranno generati nella cartella `dist/`.

## 📝 Note Tecniche

- Le clip audio vengono estratte da YouTube tramite `react-player`
- La sincronizzazione usa `requestAnimationFrame` per precisione
- Lo stato è gestito con Zustand per semplicità e performance
- Il drag & drop è gestito da `react-dnd` con HTML5 backend

## 🎵 Esempi di URL YouTube

Prova con questi video:
- https://www.youtube.com/watch?v=dQw4w9WgXcQ
- https://www.youtube.com/watch?v=jNQXAC9IVRw
- https://www.youtube.com/watch?v=9bZkp7q19f0

## 📄 Licenza

MIT License - Sentiti libero di usare questo progetto per i tuoi scopi!

---

Creato con ❤️ usando React, Vite e TailwindCSS
