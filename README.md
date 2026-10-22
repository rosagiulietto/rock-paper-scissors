# Rock Paper Scissors

Videogioco rock-paper-scissors contro il computer, in HTML/CSS/JS vanilla. Vince chi arriva prima a 5 punti, sbloccando a ogni punto una fetta dell'immagine premio.

## Requisiti

Nessuno: solo un browser. Nessuna build, nessuna dipendenza.

## Avvio

```bash
git clone <url-repo>
cd rock_paper_scissors
```

Poi apri `index.html` nel browser (doppio click).

## Struttura

```
index.html      markup
style.css       tema dark + layout responsive
index.js        logica di gioco
images/
  tools/        pulsanti s/c/f (png trasparenti)
  reward_N/     pacchetti premio: image_1.png … image_5.png (+ image_w.png = immagine intera)
  cut.py        (opzionale) ritaglia un'immagine in 5 fette per creare un pacchetto
```

## Aggiungere un pacchetto di premi

1. Crea `images/reward_X/` con `image_1.png … image_5.png` (fette dello stesso soggetto, dall'alto verso il basso) e `image_w.png` (l'immagine intera, mostrata nel modal di vittoria — deve chiamarsi esattamente `image_w.png`).
2. Aggiungi il nome della cartella all'array `rewardPacks` in `index.js`.
