# 🎵 Esempi di Utilizzo - YouTube DAW

## 📝 Scenario 1: Mix di 3 Tracce Musicali

### Obiettivo
Creare un mix con:
- Beat di batteria
- Linea di basso
- Melodia principale

### Passaggi

1. **Traccia 1 - Beat**
   ```
   URL: https://www.youtube.com/watch?v=esempio-beat
   Trim Start: 10 secondi
   Trim End: 40 secondi
   Posizione Timeline: 0 secondi
   ```

2. **Traccia 2 - Basso**
   ```
   URL: https://www.youtube.com/watch?v=esempio-bass
   Trim Start: 5 secondi
   Trim End: 35 secondi
   Posizione Timeline: 5 secondi
   ```

3. **Traccia 3 - Melodia**
   ```
   URL: https://www.youtube.com/watch?v=esempio-melody
   Trim Start: 0 secondi
   Trim End: 30 secondi
   Posizione Timeline: 10 secondi
   ```

### Risultato
```
Timeline:
0s      10s     20s     30s     40s
|-------|-------|-------|-------|
Track 1: [========BEAT==========]
Track 2:      [=====BASS======]
Track 3:           [==MELODY==]
```

---

## 📝 Scenario 2: Podcast Intro con Musica

### Obiettivo
Creare un'intro con:
- Musica di sottofondo
- Voce introduttiva
- Effetto sonoro finale

### Passaggi

1. **Traccia 1 - Musica Sottofondo**
   ```
   URL: https://www.youtube.com/watch?v=background-music
   Trim Start: 0
   Trim End: 30
   Posizione: 0s
   ```

2. **Traccia 2 - Voce**
   ```
   URL: https://www.youtube.com/watch?v=voice-intro
   Trim Start: 5
   Trim End: 20
   Posizione: 5s
   ```

3. **Traccia 3 - Sound Effect**
   ```
   URL: https://www.youtube.com/watch?v=sound-effect
   Trim Start: 0
   Trim End: 3
   Posizione: 27s
   ```

### Workflow
1. Aggiungi musica di sottofondo su Track 1
2. Aggiungi voce su Track 2, posizionata a 5s
3. Aggiungi effetto sonoro su Track 3 alla fine
4. Riproduci per testare
5. Salva sessione

---

## 📝 Scenario 3: Mashup di Canzoni

### Obiettivo
Mixare parti di 3 canzoni diverse

### Step-by-Step

1. **Trova le canzoni su YouTube**
   - Canzone A (intro)
   - Canzone B (strofa)
   - Canzone C (ritornello)

2. **Aggiungi Clip**
   - Track 1: Canzone A (0-15s) → Posizione 0s
   - Track 2: Canzone B (30-45s) → Posizione 15s
   - Track 3: Canzone C (60-75s) → Posizione 30s

3. **Perfeziona**
   - Doppio click su ogni clip
   - Affina trim start/end
   - Riposiziona per transizioni smooth

4. **Test & Save**
   - Riproduci l'intero mix
   - Salva la sessione

---

## 🎬 Tutorial: Primo Mix

### 1. Avvia l'Applicazione
```bash
cd youtube-daw
npm run dev
```

### 2. Aggiungi Prima Clip
1. Clicca "Add YouTube" su Track 1
2. Incolla: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
3. Trim Start: `0`
4. Trim End: `30`
5. Clicca "Add Clip"

### 3. Aggiungi Seconda Clip
1. Clicca "Add YouTube" su Track 2
2. Incolla un altro URL
3. Trim Start: `10`
4. Trim End: `40`
5. Clicca "Add Clip"

### 4. Posiziona Clip
1. Trascina la clip di Track 2
2. Posizionala a 10s sulla timeline
3. Rilascia

### 5. Riproduci
1. Clicca Play ▶️
2. Ascolta il mix
3. Aggiusta se necessario

### 6. Salva
1. Clicca "Save" 💾
2. La sessione è salvata!

---

## 💡 Tips Avanzati

### Tip 1: Transizioni Smooth
```
Per creare transizioni:
1. Sovrapponi le clip di 2-3 secondi
2. Track 1: [=====CLIP A=====]
   Track 2:      [=====CLIP B=====]
             ^^^^ overlap
```

### Tip 2: Loop Section
```
Per ripetere una sezione:
1. Crea 2 clip con lo stesso URL
2. Stesso trim start/end
3. Posizionale una dopo l'altra:
   [CLIP] [CLIP]
```

### Tip 3: Build-Up
```
Per creare un build-up:
1. Aggiungi 3 layer progressivamente:
   Track 1: [=========DRUMS=========]
   Track 2:      [======BASS======]
   Track 3:           [==LEAD==]
```

### Tip 4: Precisione
```
Per trim preciso:
1. Doppio click sulla clip
2. Usa valori decimali:
   - Start: 10.5 (10s e mezzo)
   - End: 35.25 (35s e un quarto)
```

---

## 🎨 Esempi di Composizioni

### Composizione 1: Ambient Soundscape
```
Track 1: Pad synth     [0s--------60s]
Track 2: Piano melody       [20s----50s]
Track 3: Nature sounds  [10s-----------70s]
```

### Composizione 2: Electronic Drop
```
Track 1: Build-up      [0s--20s]
Track 2: Drop bass          [20s------40s]
Track 3: Vocal chops         [25s--35s]
```

### Composizione 3: Film Score
```
Track 1: Strings       [0s------------60s]
Track 2: Brass              [15s---45s]
Track 3: Percussion          [20s------50s]
```

---

## 🔧 Risoluzione Problemi Comuni

### Problema: Clip non si riproduce
**Soluzione:**
1. Verifica URL YouTube sia pubblico
2. Prova con video diverso
3. Controlla console browser per errori

### Problema: Audio fuori sync
**Soluzione:**
1. Clicca Stop
2. Clicca Play di nuovo
3. Se persiste, ricarica pagina

### Problema: Clip scompare
**Soluzione:**
1. Controlla di aver cliccato "Add Clip"
2. Verifica trim end > trim start
3. Salva sessione spesso

### Problema: Drag non funziona
**Soluzione:**
1. Assicurati di cliccare e tenere premuto
2. Trascina orizzontalmente
3. Ricarica pagina se bloccato

---

## 📚 Risorse Utili

### Fonti Audio YouTube
- **Musica Royalty-Free**: YouTube Audio Library
- **Sound Effects**: Freesound (uploaded on YouTube)
- **Loops**: Splice, Looperman (sample videos)

### Link Esempio
```
Beat:     https://www.youtube.com/watch?v=dQw4w9WgXcQ
Bass:     https://www.youtube.com/watch?v=jNQXAC9IVRw
Melody:   https://www.youtube.com/watch?v=9bZkp7q19f0
```

---

## 🎯 Checklist Progetto

Prima di salvare il tuo mix:
- [ ] Tutte le clip si riproducono correttamente
- [ ] Volume è bilanciato (stesso livello percepito)
- [ ] Transizioni sono smooth
- [ ] Durata totale è quella desiderata
- [ ] Nessuna clip sovrapposta per errore
- [ ] Sessione salvata con "Save"

---

## 🌟 Idee Creative

### Idea 1: Remix Mashup
Combina intro di canzone A + strofa di canzone B + ritornello di canzone C

### Idea 2: Live Set Simulation
Crea una sequenza di 3 brani mixati come un DJ set

### Idea 3: Trailer Audio
Mix di musica epica + dialoghi + sound effects

### Idea 4: Lo-Fi Hip-Hop
Beat + sample vocale + rumore di vinile/rain

### Idea 5: Meditation Track
Nature sounds + soft pad + occasional bells

---

**Sperimenta e divertiti! La creatività non ha limiti!** 🎵✨

