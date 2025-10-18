# 🚀 Guida Rapida - YouTube DAW

## Installazione e Avvio

```bash
cd youtube-daw
npm install
npm run dev
```

L'applicazione sarà disponibile su **http://localhost:5173**

## 🎵 Funzionalità Principali

### 1. Aggiungere una Clip Audio

1. Clicca sul pulsante **"Add YouTube"** su una delle 3 tracce
2. Incolla l'URL di un video YouTube (es: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
3. Imposta **Trim Start** e **Trim End** per selezionare la porzione di audio desiderata
4. Clicca **"Add Clip"**

### 2. Spostare le Clip

- **Drag & Drop**: Trascina le clip lungo la timeline per posizionarle
- Le clip possono essere spostate liberamente tra i secondi sulla timeline
- La posizione viene aggiornata in tempo reale

### 3. Modificare una Clip

- **Doppio click** sulla clip per aprire il pannello di modifica
- Modifica **Trim Start** e **Trim End** per cambiare la porzione riprodotta
- Salva le modifiche con il pulsante **"Salva"**

### 4. Eliminare una Clip

- Clicca sull'icona **X** sulla clip per rimuoverla dalla traccia

### 5. Riproduzione

- **Play** ▶️: Avvia la riproduzione di tutte le tracce sincronizzate
- **Pause** ⏸️: Mette in pausa la riproduzione
- **Stop** ⏹️: Ferma e resetta il playhead all'inizio
- **Reset** 🔄: Riporta il playhead all'inizio

### 6. Salvare e Caricare

- **Save** 💾: Salva la sessione corrente nel browser (localStorage)
- **Load** 📂: Carica l'ultima sessione salvata

## 🎨 Interfaccia

### Timeline
- **Marker temporali**: Ogni 10 secondi
- **Playhead rosso**: Indica la posizione corrente di riproduzione
- **Durata totale**: 120 secondi (2 minuti)

### Tracce
- **3 tracce disponibili**: Track 1, Track 2, Track 3
- **Clip colorate**: Gradiente blu-viola
- **Waveform simulata**: Rappresentazione visiva dell'audio

### Controlli Transport
- Visualizzazione del **tempo corrente** in formato MM:SS
- Pulsanti di controllo con animazioni fluide
- Salvataggio rapido della sessione

## 💡 Tips & Tricks

1. **Sovrapposizione**: Puoi sovrapporre clip su tracce diverse per creare mix complessi
2. **Trim preciso**: Usa valori decimali (es: 10.5s) per precisione al decimo di secondo
3. **Sessioni**: Le sessioni sono salvate automaticamente nel browser, ma puoi anche usare i pulsanti Save/Load
4. **YouTube**: Funziona con qualsiasi video YouTube pubblico

## 🔧 Scorciatoie

- **Spazio**: Play/Pause (se implementato)
- **Doppio click sulla clip**: Apri pannello modifica
- **Drag & Drop**: Sposta clip

## 📦 Struttura Componenti

```
App.jsx
├── TransportControls    (Play, Pause, Stop, Save, Load)
├── Timeline             (Marker temporali, Playhead)
├── Track (x3)           (Traccia audio con controlli)
│   └── Clip (dinamici)  (Clip audio draggabili)
│       └── ClipInfo     (Modal modifica clip)
├── EmptyState           (Guida iniziale)
└── PlayerManager        (Gestione player YouTube nascosti)
```

## 🎯 Workflow Consigliato

1. **Prepara i link**: Trova 3 video YouTube con la musica/audio che vuoi mixare
2. **Aggiungi le clip**: Inserisci una clip per ogni traccia
3. **Taglia**: Usa Trim Start/End per selezionare le parti interessanti
4. **Posiziona**: Trascina le clip sulla timeline per creare la sequenza
5. **Riproduci**: Ascolta il risultato e perfeziona
6. **Salva**: Non dimenticare di salvare la sessione!

## 🐛 Troubleshooting

### Le clip non si riproducono
- Verifica che l'URL YouTube sia corretto e pubblico
- Alcuni video potrebbero avere restrizioni di embedding

### La riproduzione è fuori sync
- Prova a fermare e riavviare la riproduzione
- Ricarica la pagina se il problema persiste

### Le clip scompaiono
- Assicurati di salvare la sessione con il pulsante Save
- Il browser potrebbe cancellare il localStorage se lo spazio è limitato

## 🌟 Esempi di URL YouTube

Prova con questi esempi:

```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://www.youtube.com/watch?v=jNQXAC9IVRw
https://www.youtube.com/watch?v=9bZkp7q19f0
```

## 📚 Tecnologie

- **React 19** - Framework UI
- **Vite** - Build tool
- **TailwindCSS 4** - Styling
- **Zustand** - State management
- **React DnD** - Drag and drop
- **Framer Motion** - Animazioni
- **React Player** - YouTube player

---

**Buon divertimento con YouTube DAW!** 🎵

