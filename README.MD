# 🐙 DomHouse Octopus Card per Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![version](https://img.shields.io/badge/version-v1.0.0-blue.svg)]()
[![maintainer](https://img.shields.io/badge/maintainer-Salvatore_Lentini_--_DomHouse.it-green.svg)](https://www.domhouse.it)

Una suite elegante e intelligente di Custom Cards per Home Assistant dedicata ai clienti **Octopus Energy Italia**. Progettata con un design *Glassmorphism* moderno, ti permette di monitorare il tuo contratto e confrontare in tempo reale la tua tariffa attuale con le nuove offerte pubbliche sul sito ufficiale.

*(Inserisci qui lo screenshot della tua dashboard)*

## ⚠️ Prerequisiti

Per far funzionare questa suite e popolare correttamente i dati, **è strettamente necessario** avere installato e configurato le seguenti integrazioni HACS:

* **[OctopusEnergyIT](https://github.com/samuelebistoletti/HomeAssistant-OctopusEnergyIT)**

## 🌟 Funzionalità Principali

Questa suite include **due card distinte** in un unico pacchetto super ottimizzato.
Nel menu di Home Assistant appariranno come due schede separate e pronte all'uso.

### 👉 Rendering Dinamico (Smart UI)
Hai solo la fornitura Luce? O magari solo il Gas? Nessun problema! **Lascia vuoti i campi che non ti interessano e la card si ridimensionerà automaticamente**, nascondendo i riquadri inutili e centrando i contenuti. Niente più fastidiosi "N/A" o spazi vuoti sulla tua dashboard!

### 1. ⚖️ Confronto vs Sito Ufficiale
Analizza in tempo reale il tuo prezzo dell'energia e i costi di commercializzazione (PCV/QVD) confrontandoli con le tariffe pubbliche sul sito Octopus. 
* Ti fornisce un **verdetto matematico e visivo** (Verde = tieni la tua tariffa, Rosso = aggiorna subito).
* Supporta il confronto sia per chi ha tariffe **Fisse** che **Variabili (Flex)** tramite un comodo menu a tendina.
* Mostra un riquadro extra dinamico per farti tenere d'occhio le altre tariffe disponibili.

### 2. 🐙 Il Mio Contratto
Una panoramica completa ed elegante della tua fornitura. Mostra:
* Lo stato di attivazione (con badge colorato "FORNITURA ATTIVA").
* I costi attuali.
* I giorni rimanenti alla scadenza (con colori di avviso: verde, giallo, rosso).
* La data dell'ultima lettura.

Entrambe le card supportano l'**Editor Visuale (GUI)** nativo di Home Assistant: non dovrai scrivere una riga di codice YAML!

---

## 📥 Installazione tramite HACS (Consigliata)

1. Apri **HACS** nel tuo Home Assistant.
2. Clicca sui tre puntini in alto a destra e seleziona **Custom repositories** (Repository personalizzati).
3. Incolla l'URL di questo repository GitHub: `https://github.com/SalvatoreITA/domhouse-octopus-card
4. Come categoria (Category) scegli **Lovelace**.
5. Clicca su **Add** (Aggiungi).
6. Ora cerca "DomHouse Octopus Card" in HACS, clicca su **Download** e poi ricarica la pagina del tuo browser.

---

### Installazione Manuale (Senza HACS)
1. Scarica il file `domhouse-octopus-bundle.js`.
2. Copialo nella tua cartella `www` di Home Assistant (di solito `/config/www/`).
3. Vai su **Impostazioni > Dashboard > Risorse**.
4. Aggiungi una nuova risorsa: `/local/domhouse-octopus-bundle.js` impostando il tipo su **Modulo JavaScript**.
5. Ricarica la pagina.

---

## ⚙️ Configurazione sulla Dashboard

Una volta installata la risorsa, vai sulla tua plancia (Dashboard), clicca su "Modifica plancia" e poi su "Aggiungi scheda". Cerca:
* **DomHouse Octopus Card - Confronto**
* **DomHouse Octopus Card - Il Mio Contratto**

Seleziona quella che desideri e usa l'editor grafico per assegnare i sensori forniti dall'integrazione ufficiale Octopus. **Ricorda: i campi lasciati vuoti spariranno magicamente dalla card!** Per nascondere il titolo principale, ti basterà svuotare il relativo campo di testo.

---

## 🎁 Bonus: Blueprint Automazione (Notifiche Push & WhatsApp)
Vuoi essere avvisato automaticamente sul cellulare quando i prezzi sul sito crollano sotto la tua tariffa?
Nella cartella `blueprints` di questo repository troverai il file `domhouse_octopus_tracker.yaml`. 

Importalo in Home Assistant per avere un'automazione infallibile che:
1. Controlla silenziosamente i prezzi ogni volta che si aggiornano.
2. Verifica matematicamente che ci sia un risparmio reale (inclusi i costi fissi).
3. Ti invia una **Notifica Push sul cellulare**.
4. Include un **pulsante rapido nella notifica** che apre direttamente **WhatsApp** con l'assistenza clienti Octopus e un messaggio preimpostato per chiedere l'aggiornamento della tariffa!



---
*Progettato e sviluppato per la community. Powered by [DomHouse.it](https://www.domhouse.it)*
