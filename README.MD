
# 🐙 DomHouse Octopus Suite per Home Assistant

Una suite elegante e intelligente di Custom Cards per Home Assistant dedicata ai clienti **Octopus Energy Italia**. Progettata con un design *Glassmorphism* moderno, ti permette di monitorare il tuo contratto e confrontare in tempo reale la tua tariffa attuale con le nuove offerte pubbliche sul sito ufficiale.

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg)

*(Inserisci qui lo screenshot della tua dashboard)*

## 🌟 Funzionalità Principali

Questa suite include **due card distinte** in un unico pacchetto leggero:

1. **⚖️ Confronto vs Sito Ufficiale (`domhouse-octopus-card`)**: 
   Analizza in tempo reale il tuo prezzo dell'energia e i costi di commercializzazione (PCV/QVD) confrontandoli con le tariffe attuali sul sito Octopus. Ti fornisce un verdetto matematico e visivo (Verde = tieni la tua, Rosso = aggiorna subito) per farti risparmiare. Supporta sia il confronto tra tariffe Fisse che Variabili (Flex).
2. **🐙 Il Mio Contratto (`domhouse-my-contract-card`)**: 
   Una panoramica completa ed elegante della tua fornitura Luce e Gas. Mostra lo stato di attivazione, i costi attuali, i giorni rimanenti alla scadenza e la data dell'ultima lettura.

Entrambe le card supportano l'**Editor Visuale (GUI)** nativo di Home Assistant: non dovrai scrivere una riga di codice YAML, potrai selezionare i tuoi sensori comodamente da un menu a tendina!

## 📥 Installazione tramite HACS (Consigliata)

1. Apri **HACS** nel tuo Home Assistant.
2. Clicca sui tre puntini in alto a destra e seleziona **Custom repositories** (Repository personalizzati).
3. Incolla l'URL di questo repository GitHub: `https://github.com/TUO-NOME-UTENTE/domhouse-octopus-suite` *(Sostituisci con il tuo link reale)*.
4. Come categoria (Category) scegli **Lovelace**.
5. Clicca su **Add** (Aggiungi).
6. Ora cerca "DomHouse Octopus Suite" in HACS, clicca su **Download** e poi ricarica la pagina del tuo browser.

## ⚙️ Configurazione

Una volta installata, vai sulla tua plancia (Dashboard), clicca su "Modifica plancia" e poi su "Aggiungi scheda". Cerca:
* **DomHouse Octopus Card - Confronto**
* **DomHouse Octopus Card - Il Mio Contratto**

Seleziona quella che desideri e usa il comodo menu grafico per assegnare i sensori Octopus forniti dall'integrazione ufficiale.

### Opzioni Editor Grafico
* **Titolo**: Puoi personalizzare il titolo o lasciarlo vuoto per nasconderlo.
* **Tipo Tariffa (Solo Confronto)**: Scegli se attualmente possiedi una tariffa Fissa o Variabile (Flex) per far adattare automaticamente la card.
* I sensori vuoti verranno gestiti in modo intelligente (es. se non hai il Gas, compila solo la sezione Luce).

---

### Installazione Manuale (Senza HACS)
1. Scarica il file `domhouse-octopus-bundle.js`.
2. Copialo nella tua cartella `www` di Home Assistant (di solito `/config/www/`).
3. Vai su **Impostazioni > Dashboard > Risorse**.
4. Aggiungi una nuova risorsa: `/local/domhouse-octopus-bundle.js` impostando il tipo su **Modulo JavaScript**.
5. Ricarica la pagina.

## 🎁 Bonus: Blueprint per Automazione
Vuoi essere avvisato automaticamente sul cellulare quando i prezzi sul sito crollano sotto la tua tariffa? 
Usa il nostro Blueprint ufficiale per creare un'automazione infallibile:
*(Qui puoi caricare il file YAML del blueprint nella tua repository e mettere il link per scaricarlo o importarlo)*

---
*Powered by [DomHouse.it](https://www.domhouse.it)*
