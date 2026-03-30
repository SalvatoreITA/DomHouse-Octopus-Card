console.info("%c 🐙 DOMHOUSE OCTOPUS SUITE v1.0.1 (THEME SELECTOR) IS LOADED ", "color: white; background: #ff00ff; font-weight: bold; border: 1px solid white; padding: 2px 6px; border-radius: 4px;");

const LitElement = customElements.get("ha-panel-lovelace")
  ? Object.getPrototypeOf(customElements.get("ha-panel-lovelace"))
  : Object.getPrototypeOf(customElements.get("hc-lovelace"));
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

// =============================================================================
//  1. CARD: CONFRONTO VS SITO UFFICIALE (domhouse-octopus-card)
// =============================================================================
class DomHouseOctopusCard extends LitElement {
  static get properties() { return { _config: {}, hass: {} }; }
  static getConfigElement() { return document.createElement("domhouse-octopus-card-editor"); }

  static getStubConfig() {
    return {
      title: "⚖️ Confronto vs Sito Ufficiale",
      tariff_type: "fissa",
      theme_mode: "default"
    };
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    this._config = config;
  }

  getSensorValue(entityId, decimals, fallback = 999) {
    if (!entityId || !this.hass || !this.hass.states[entityId]) return { val: fallback, str: 'N/A' };
    const state = this.hass.states[entityId].state;
    const num = parseFloat(state);
    if (isNaN(num)) return { val: fallback, str: 'N/A' };
    return { val: num, str: num.toFixed(decimals) };
  }

  render() {
    if (!this._config || !this.hass) return html``;

    const titleHtml = this._config.title
        ? html`<div class="card-header-main">${this._config.title}</div>`
        : html``;

    const tariffType = this._config.tariff_type || "fissa";
    const themeMode = this._config.theme_mode || "default";
    const cardClass = themeMode === "dark" ? "force-dark" : "theme-default";

    const hasLuce = !!this._config.luce_prezzo_tu;
    const hasGas = !!this._config.gas_prezzo_tu;
    const hasExtraLuce = !!this._config.extra_luce;
    const hasExtraGas = !!this._config.extra_gas;

    // --- BLOCCO LUCE ---
    let luceBox = html``;
    let verdettoLuceHtml = html``;

    if (hasLuce) {
      const l_tu = this.getSensorValue(this._config.luce_prezzo_tu, 4);
      const l_sito = this.getSensorValue(this._config.luce_prezzo_sito, 4);
      const pcv_tu = this.getSensorValue(this._config.luce_pcv_tu, 1);
      const pcv_sito = this.getSensorValue(this._config.luce_pcv_sito, 1);

      const convieneSitoPrezzoL = l_sito.val < l_tu.val;
      const convieneSitoPcvL = pcv_sito.val < pcv_tu.val;
      const icon_prezzo_l = convieneSitoPrezzoL ? '🔴 Sito' : '🟢 Tu';
      const color_prezzo_l = convieneSitoPrezzoL ? '#ff5252' : '#00e676';
      const icon_pcv_l = convieneSitoPcvL ? '🔴 Sito' : '🟢 Tu';
      const color_pcv_l = convieneSitoPcvL ? '#ff5252' : '#00e676';

      let msgLuce = "", colLuce = "", iconLuce = "";
      if (l_sito.val < l_tu.val && pcv_sito.val <= pcv_tu.val) { msgLuce = "Aggiorna subito! Il sito è più economico."; colLuce = "#ff5252"; iconLuce = "🔴"; }
      else if (l_tu.val < l_sito.val && pcv_tu.val <= pcv_sito.val) { msgLuce = "Tieniti stretta la tua tariffa attuale!"; colLuce = "#00e676"; iconLuce = "🟢"; }
      else if (l_sito.val < l_tu.val && pcv_sito.val > pcv_tu.val) { msgLuce = "Sito vince sul prezzo, tu sulla PCV. Valuta i consumi."; colLuce = "#ffd600"; iconLuce = "⚖️"; }
      else { msgLuce = "La tua vince sul prezzo, sito sulla PCV. Tieni la tua se consumi molto."; colLuce = "#ffd600"; iconLuce = "⚖️"; }

      verdettoLuceHtml = html`
        <div style="background: var(--secondary-background-color); padding: 10px; border-radius: 8px; border-left: 4px solid ${colLuce}; color: var(--primary-text-color);">
          <b style="color: #00d1ff;">LUCE:</b> ${iconLuce} ${msgLuce}
        </div>
      `;

      luceBox = html`
        <div class="glass-box bordered">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid var(--divider-color); padding-bottom: 10px;">
            <div style="font-size: 18px; font-weight: bold; color: #00d1ff;">💡 ENERGIA ELETTRICA</div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; color: var(--primary-text-color);">
            <div style="background: var(--secondary-background-color); padding: 10px; border-radius: 10px;">
              <div style="color: var(--secondary-text-color); margin-bottom: 8px; font-weight: bold;">⚡ Prezzo (Є/kWh)</div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>Tu:</span> <b>${l_tu.str}</b></div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;"><span>Sito:</span> <b>${l_sito.str}</b></div>
              <div style="text-align: right; font-size: 11px; font-weight: bold; color: ${color_prezzo_l}; border-top: 1px solid var(--divider-color); padding-top: 6px;">Vince: ${icon_prezzo_l}</div>
            </div>
            <div style="background: var(--secondary-background-color); padding: 10px; border-radius: 10px;">
              <div style="color: var(--secondary-text-color); margin-bottom: 8px; font-weight: bold;">🏢 PCV (Є/anno)</div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>Tu:</span> <b>${pcv_tu.str}</b></div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;"><span>Sito:</span> <b>${pcv_sito.str}</b></div>
              <div style="text-align: right; font-size: 11px; font-weight: bold; color: ${color_pcv_l}; border-top: 1px solid var(--divider-color); padding-top: 6px;">Vince: ${icon_pcv_l}</div>
            </div>
          </div>
        </div>
      `;
    }

    // --- BLOCCO GAS ---
    let gasBox = html``;
    let verdettoGasHtml = html``;

    if (hasGas) {
      const g_tu = this.getSensorValue(this._config.gas_prezzo_tu, 4);
      const g_sito = this.getSensorValue(this._config.gas_prezzo_sito, 4);
      const qvd_tu = this.getSensorValue(this._config.gas_qvd_tu, 1);
      const qvd_sito = this.getSensorValue(this._config.gas_qvd_sito, 1);

      const convieneSitoPrezzoG = g_sito.val < g_tu.val;
      const convieneSitoQvdG = qvd_sito.val < qvd_tu.val;
      const icon_prezzo_g = convieneSitoPrezzoG ? '🔴 Sito' : '🟢 Tu';
      const color_prezzo_g = convieneSitoPrezzoG ? '#ff5252' : '#00e676';
      const icon_qvd_g = convieneSitoQvdG ? '🔴 Sito' : '🟢 Tu';
      const color_qvd_g = convieneSitoQvdG ? '#ff5252' : '#00e676';

      let msgGas = "", colGas = "", iconGas = "";
      if (g_sito.val < g_tu.val && qvd_sito.val <= qvd_tu.val) { msgGas = "Aggiorna subito! Il sito è più economico."; colGas = "#ff5252"; iconGas = "🔴"; }
      else if (g_tu.val < g_sito.val && qvd_tu.val <= qvd_sito.val) { msgGas = "Tieniti stretta la tua tariffa attuale!"; colGas = "#00e676"; iconGas = "🟢"; }
      else if (g_sito.val < g_tu.val && qvd_sito.val > qvd_tu.val) { msgGas = "Sito vince sul prezzo, tu sulla QVD. Valuta i consumi."; colGas = "#ffd600"; iconGas = "⚖️"; }
      else { msgGas = "La tua vince sul prezzo, sito sulla QVD. Tieni la tua se consumi molto."; colGas = "#ffd600"; iconGas = "⚖️"; }

      verdettoGasHtml = html`
        <div style="background: var(--secondary-background-color); padding: 10px; border-radius: 8px; border-left: 4px solid ${colGas}; color: var(--primary-text-color);">
          <b style="color: #ff9800;">GAS:</b> ${iconGas} ${msgGas}
        </div>
      `;

      gasBox = html`
        <div class="glass-box bordered">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid var(--divider-color); padding-bottom: 10px;">
            <div style="font-size: 18px; font-weight: bold; color: #ff9800;">🔥 GAS NATURALE</div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; color: var(--primary-text-color);">
            <div style="background: var(--secondary-background-color); padding: 10px; border-radius: 10px;">
              <div style="color: var(--secondary-text-color); margin-bottom: 8px; font-weight: bold;">⚡ Prezzo (Є/Smc)</div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>Tu:</span> <b>${g_tu.str}</b></div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;"><span>Sito:</span> <b>${g_sito.str}</b></div>
              <div style="text-align: right; font-size: 11px; font-weight: bold; color: ${color_prezzo_g}; border-top: 1px solid var(--divider-color); padding-top: 6px;">Vince: ${icon_prezzo_g}</div>
            </div>
            <div style="background: var(--secondary-background-color); padding: 10px; border-radius: 10px;">
              <div style="color: var(--secondary-text-color); margin-bottom: 8px; font-weight: bold;">🏢 QVD (Є/anno)</div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>Tu:</span> <b>${qvd_tu.str}</b></div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;"><span>Sito:</span> <b>${qvd_sito.str}</b></div>
              <div style="text-align: right; font-size: 11px; font-weight: bold; color: ${color_qvd_g}; border-top: 1px solid var(--divider-color); padding-top: 6px;">Vince: ${icon_qvd_g}</div>
            </div>
          </div>
        </div>
      `;
    }

    // --- BLOCCO VERDETTO GLOBALE ---
    let verdettoBox = html``;
    if (hasLuce || hasGas) {
      verdettoBox = html`
        <div class="glass-box bordered">
          <div style="font-size: 16px; font-weight: bold; color: var(--primary-text-color); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">🏆 Il Verdetto</div>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
            ${verdettoLuceHtml}
            ${verdettoGasHtml}
          </div>
        </div>
      `;
    }

    // --- BLOCCO EXTRA ---
    let extraBox = html``;
    if (hasExtraLuce || hasExtraGas) {
      const extraTitle = tariffType === "fissa" ? "📊 Spread Tariffe Flex Attuali sul Sito" : "📊 Tariffe Fisse Attuali sul Sito";
      const extra_l = this.getSensorValue(this._config.extra_luce, 4, 0);
      const extra_g = this.getSensorValue(this._config.extra_gas, 4, 0);

      const gridCols = (hasExtraLuce && hasExtraGas) ? "1fr 1fr" : "1fr";

      extraBox = html`
        <div class="glass-box extra-box">
           <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <div style="font-size: 14px; font-weight: bold; color: var(--primary-text-color);">${extraTitle}</div>
          </div>
          <div style="display: grid; grid-template-columns: ${gridCols}; gap: 10px; font-size: 13px; color: var(--primary-text-color);">
            ${hasExtraLuce ? html`
              <div style="background: var(--secondary-background-color); padding: 10px; border-radius: 10px; text-align: center;">
                <div style="color: var(--secondary-text-color); margin-bottom: 5px;">Luce Monoraria</div>
                <div style="font-size: 15px; font-weight: bold;">${extra_l.str} <span style="font-size: 11px; font-weight: normal; color: var(--secondary-text-color);">€/kWh</span></div>
              </div>
            ` : html``}
            ${hasExtraGas ? html`
              <div style="background: var(--secondary-background-color); padding: 10px; border-radius: 10px; text-align: center;">
                <div style="color: var(--secondary-text-color); margin-bottom: 5px;">Gas</div>
                <div style="font-size: 15px; font-weight: bold;">${extra_g.str} <span style="font-size: 11px; font-weight: normal; color: var(--secondary-text-color);">€/Smc</span></div>
              </div>
            ` : html``}
          </div>
        </div>
      `;
    }

    return html`
      <ha-card class="${cardClass}">
        ${titleHtml}
        <div class="main-container" style="${!this._config.title ? 'margin-top: 0;' : ''}">
          ${luceBox}
          ${gasBox}
          ${verdettoBox}
          ${extraBox}
          ${!hasLuce && !hasGas && !hasExtraLuce && !hasExtraGas ? html`<div style="text-align: center; color: var(--secondary-text-color); padding: 20px;">Nessun sensore configurato.<br>Apri l'editor per aggiungere i sensori che ti interessano!</div>` : html``}
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      :host { display: block; font-family: var(--primary-font-family, sans-serif); }
      ha-card { border-radius: 20px; padding: 20px; box-sizing: border-box; transition: background 0.3s ease; }

      /* OVERRIDE FOR DARK THEME */
      ha-card.force-dark {
        background: linear-gradient(145deg, #1a1a1a, #282828);
        color: white;
        --primary-text-color: #ffffff;
        --secondary-text-color: #aaaaaa;
        --secondary-background-color: rgba(0,0,0,0.2);
        --divider-color: rgba(255,255,255,0.1);
        --ha-card-box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      }
      ha-card.force-dark .glass-box { background: rgba(255, 255, 255, 0.05); }

      .card-header-main { font-weight: 800; font-size: 24px; color: var(--primary-text-color); padding-bottom: 5px; }
      .main-container { display: flex; flex-direction: column; gap: 20px; margin-top: 20px; }
      .glass-box { background: transparent; padding: 15px; box-sizing: border-box; border-radius: 15px; }
      .bordered { border: 1px solid var(--divider-color); box-shadow: var(--ha-card-box-shadow, 0 4px 15px rgba(0,0,0,0.1)); }
      .extra-box { border-radius: 12px; font-size: 14px; border: none; box-shadow: none; }
      div { box-sizing: border-box; }
    `;
  }
}
customElements.define("domhouse-octopus-card", DomHouseOctopusCard);

class DomHouseOctopusCardEditor extends LitElement {
  static get properties() { return { hass: {}, _config: {} }; }
  setConfig(config) { this._config = config; }
  _valueChanged(ev) {
    if (!this._config || !this.hass) return;
    const target = ev.target;
    const configValue = target.configValue;
    if (!configValue) return;
    let newValue = ev.type === 'value-changed' ? ev.detail.value : target.value;
    if (this._config[configValue] === newValue) return;
    const newConfig = { ...this._config };
    if (newValue === "" || newValue === undefined || newValue === null) delete newConfig[configValue];
    else newConfig[configValue] = newValue;
    this._config = newConfig;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
  }

  render() {
    if (!this.hass || !this._config) return html``;
    return html`
      <div class="card-config">
        <div class="vertical-inputs">
            <ha-textfield label="Titolo Card (lascia vuoto per nasconderlo)" .value=${this._config.title !== undefined ? this._config.title : '⚖️ Confronto vs Sito Ufficiale'} .configValue=${"title"} @input=${this._valueChanged}></ha-textfield>
            <ha-selector .hass=${this.hass} .selector=${{ select: { options: [{value: "default", label: "Segui Tema Home Assistant (Chiaro/Scuro)"}, {value: "dark", label: "Colore Statico (Scuro Fisso)"}] } }} .value=${this._config.theme_mode || 'default'} .configValue=${"theme_mode"} .label=${"Stile Sfondo Card"} @value-changed=${this._valueChanged}></ha-selector>
            <ha-selector .hass=${this.hass} .selector=${{ select: { options: [{value: "fissa", label: "Tariffa Fissa"}, {value: "variabile", label: "Tariffa Variabile (Flex)"}] } }} .value=${this._config.tariff_type || 'fissa'} .configValue=${"tariff_type"} .label=${"Tipo della tua Tariffa Attuale"} @value-changed=${this._valueChanged}></ha-selector>
        </div>
        <div class="sensor-group"><h4>💡 Sensori Luce (Opzionali)</h4><div class="vertical-inputs">
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor", "input_number"] } }} .value=${this._config.luce_prezzo_tu || ''} .configValue=${"luce_prezzo_tu"} .label=${"Il Tuo Prezzo Luce"} @value-changed=${this._valueChanged}></ha-selector>
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor", "input_number"] } }} .value=${this._config.luce_pcv_tu || ''} .configValue=${"luce_pcv_tu"} .label=${"La Tua PCV Luce"} @value-changed=${this._valueChanged}></ha-selector>
            <div class="divider"></div>
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor", "input_number"] } }} .value=${this._config.luce_prezzo_sito || ''} .configValue=${"luce_prezzo_sito"} .label=${"Prezzo Sito (Luce)"} @value-changed=${this._valueChanged}></ha-selector>
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor", "input_number"] } }} .value=${this._config.luce_pcv_sito || ''} .configValue=${"luce_pcv_sito"} .label=${"PCV Sito (Luce)"} @value-changed=${this._valueChanged}></ha-selector>
        </div></div>
        <div class="sensor-group"><h4>🔥 Sensori Gas (Opzionali)</h4><div class="vertical-inputs">
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor", "input_number"] } }} .value=${this._config.gas_prezzo_tu || ''} .configValue=${"gas_prezzo_tu"} .label=${"Il Tuo Prezzo Gas"} @value-changed=${this._valueChanged}></ha-selector>
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor", "input_number"] } }} .value=${this._config.gas_qvd_tu || ''} .configValue=${"gas_qvd_tu"} .label=${"La Tua QVD Gas"} @value-changed=${this._valueChanged}></ha-selector>
            <div class="divider"></div>
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor", "input_number"] } }} .value=${this._config.gas_prezzo_sito || ''} .configValue=${"gas_prezzo_sito"} .label=${"Prezzo Sito (Gas)"} @value-changed=${this._valueChanged}></ha-selector>
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor", "input_number"] } }} .value=${this._config.gas_qvd_sito || ''} .configValue=${"gas_qvd_sito"} .label=${"QVD Sito (Gas)"} @value-changed=${this._valueChanged}></ha-selector>
        </div></div>
        <div class="sensor-group"><h4>📊 Sensori Riquadro Inferiore (Opzionali)</h4><div class="vertical-inputs">
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor", "input_number"] } }} .value=${this._config.extra_luce || ''} .configValue=${"extra_luce"} .label=${"Sensore Extra Luce"} @value-changed=${this._valueChanged}></ha-selector>
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor", "input_number"] } }} .value=${this._config.extra_gas || ''} .configValue=${"extra_gas"} .label=${"Sensore Extra Gas"} @value-changed=${this._valueChanged}></ha-selector>
        </div></div>
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid var(--divider-color); text-align: center; opacity: 0.7; font-size: 0.9em;">Powered by <a href="https://www.domhouse.it" target="_blank" style="color: var(--primary-color); text-decoration: none; font-weight: bold;">DomHouse.it</a></div>
      </div>
    `;
  }
  static get styles() {
    return css`
      .card-config { padding: 10px; } h4 { margin-bottom: 10px; margin-top: 0; padding-bottom: 5px; color: var(--primary-text-color); }
      .sensor-group { background: var(--secondary-background-color); padding: 15px; border-radius: 8px; margin-top: 20px; border: 1px solid var(--divider-color); }
      .vertical-inputs { display: flex; flex-direction: column; gap: 12px; width: 100%; }
      .divider { margin-top: 5px; border-top: 1px dashed var(--divider-color); padding-top: 5px; }
      ha-selector, ha-textfield { width: 100%; display: block; }
    `;
  }
}
customElements.define("domhouse-octopus-card-editor", DomHouseOctopusCardEditor);


// =============================================================================
//  2. CARD: IL MIO CONTRATTO (domhouse-my-contract-card)
// =============================================================================
class DomHouseMyContractCard extends LitElement {
  static get properties() { return { _config: {}, hass: {} }; }
  static getConfigElement() { return document.createElement("domhouse-my-contract-card-editor"); }

  static getStubConfig() {
    return {
      title: "🐙 Octopus: Il Mio Contratto",
      theme_mode: "default"
    };
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    this._config = config;
  }

  getStringValue(entityId, fallback = 'N/A') { return (!entityId || !this.hass || !this.hass.states[entityId]) ? fallback : this.hass.states[entityId].state; }
  getNumberValue(entityId, decimals, fallbackStr = 'N/A') {
    if (!entityId || !this.hass || !this.hass.states[entityId]) return fallbackStr;
    const num = parseFloat(this.hass.states[entityId].state);
    return isNaN(num) ? fallbackStr : num.toFixed(decimals);
  }
  getIntValue(entityId, fallback = 0) {
    if (!entityId || !this.hass || !this.hass.states[entityId]) return fallback;
    const num = parseInt(this.hass.states[entityId].state, 10);
    return isNaN(num) ? fallback : num;
  }

  render() {
    if (!this._config || !this.hass) return html``;

    const titleHtml = this._config.title ? html`<div class="card-title">${this._config.title}</div>` : html``;

    const themeMode = this._config.theme_mode || "default";
    const cardClass = themeMode === "dark" ? "force-dark" : "theme-default";

    const hasLuce = !!this._config.l_prodotto;
    const hasGas = !!this._config.g_prodotto;

    let luceBox = html``;
    if (hasLuce) {
      const l_prod = this.getStringValue(this._config.l_prodotto);
      const l_raw_stato = this.getStringValue(this._config.l_stato).toUpperCase();
      const l_prezzo = this.getNumberValue(this._config.l_prezzo, 4);
      const l_pcv = this.getNumberValue(this._config.l_pcv, 1);
      const l_fine = this.getStringValue(this._config.l_fine);
      const l_giorni = this.getIntValue(this._config.l_giorni);
      const l_lettura = this.getStringValue(this._config.l_lettura);
      const l_isAttiva = l_raw_stato === 'ON_SUPPLY' || l_raw_stato.includes('ATTIV');
      const l_textStato = l_isAttiva ? 'FORNITURA ATTIVA' : 'FORNITURA CESSATA';
      const l_statoColor = l_isAttiva ? '#00e676' : '#ff5252';
      const l_giorniColor = l_giorni < 30 ? '#ff5252' : (l_giorni < 90 ? '#ffd600' : '#00e676');

      luceBox = html`
        <div class="glass-box bordered">
          <div class="flex-header" style="border-bottom: 1px solid var(--divider-color); padding-bottom: 10px; margin-bottom: 15px;">
            <div style="font-size: 18px; font-weight: bold; color: #00d1ff;">💡 ENERGIA ELETTRICA</div>
            <div class="status-badge" style="border: 1px solid ${l_statoColor}; color: ${l_statoColor}; background: var(--secondary-background-color);">${l_textStato}</div>
          </div>
          <div style="font-size: 14px; margin-bottom: 15px; color: var(--primary-text-color);"><span style="color: var(--secondary-text-color);">Prodotto:</span> <b>${l_prod}</b></div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; color: var(--primary-text-color);">
            <div style="background: var(--secondary-background-color); padding: 10px; border-radius: 10px;">
              <div style="color: var(--secondary-text-color); margin-bottom: 5px;">💰 Costi Attuali</div><div>Energia: <b>${l_prezzo} €/kWh</b></div><div>PCV: <b>${l_pcv} €/anno</b></div>
            </div>
            <div style="background: var(--secondary-background-color); padding: 10px; border-radius: 10px;">
              <div style="color: var(--secondary-text-color); margin-bottom: 5px;">📅 Scadenze</div><div>Fine: <b>${l_fine}</b></div><div style="color: ${l_giorniColor}; font-weight: bold;">Tra ${l_giorni} giorni</div>
            </div>
          </div>
          <div style="margin-top: 15px; font-size: 11px; color: var(--secondary-text-color); text-align: right;">Ultima lettura: ${l_lettura}</div>
        </div>
      `;
    }

    let gasBox = html``;
    if (hasGas) {
      const g_prod = this.getStringValue(this._config.g_prodotto);
      const g_raw_stato = this.getStringValue(this._config.g_stato).toUpperCase();
      const g_prezzo = this.getNumberValue(this._config.g_prezzo, 4);
      const g_qvd = this.getNumberValue(this._config.g_qvd, 1);
      const g_fine = this.getStringValue(this._config.g_fine);
      const g_giorni = this.getIntValue(this._config.g_giorni);
      const g_lettura = this.getStringValue(this._config.g_lettura);
      const g_isAttiva = g_raw_stato === 'ON_SUPPLY' || g_raw_stato.includes('ATTIV');
      const g_textStato = g_isAttiva ? 'FORNITURA ATTIVA' : 'FORNITURA CESSATA';
      const g_statoColor = g_isAttiva ? '#00e676' : '#ff5252';
      const g_giorniColor = g_giorni < 30 ? '#ff5252' : (g_giorni < 90 ? '#ffd600' : '#00e676');

      gasBox = html`
        <div class="glass-box bordered">
          <div class="flex-header" style="border-bottom: 1px solid var(--divider-color); padding-bottom: 10px; margin-bottom: 15px;">
            <div style="font-size: 18px; font-weight: bold; color: #ff9800;">🔥 GAS NATURALE</div>
            <div class="status-badge" style="border: 1px solid ${g_statoColor}; color: ${g_statoColor}; background: var(--secondary-background-color);">${g_textStato}</div>
          </div>
          <div style="font-size: 14px; margin-bottom: 15px; color: var(--primary-text-color);"><span style="color: var(--secondary-text-color);">Prodotto:</span> <b>${g_prod}</b></div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; color: var(--primary-text-color);">
            <div style="background: var(--secondary-background-color); padding: 10px; border-radius: 10px;">
              <div style="color: var(--secondary-text-color); margin-bottom: 5px;">💰 Costi Attuali</div><div>Materia: <b>${g_prezzo} €/Smc</b></div><div>QVD: <b>${g_qvd} €/anno</b></div>
            </div>
            <div style="background: var(--secondary-background-color); padding: 10px; border-radius: 10px;">
              <div style="color: var(--secondary-text-color); margin-bottom: 5px;">📅 Scadenze</div><div>Fine: <b>${g_fine}</b></div><div style="color: ${g_giorniColor}; font-weight: bold;">Tra ${g_giorni} giorni</div>
            </div>
          </div>
          <div style="margin-top: 15px; font-size: 11px; color: var(--secondary-text-color); text-align: right;">Ultima lettura: ${g_lettura}</div>
        </div>
      `;
    }

    return html`
      <ha-card class="${cardClass}">
        ${titleHtml}
        <div class="main-grid" style="${!this._config.title ? 'margin-top: 0;' : ''}">
          ${luceBox}
          ${gasBox}
          ${!hasLuce && !hasGas ? html`<div style="text-align: center; color: var(--secondary-text-color); padding: 20px;">Nessun sensore configurato.<br>Apri l'editor per aggiungere i sensori che ti interessano!</div>` : html``}
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      :host { display: block; font-family: var(--primary-font-family, sans-serif); }
      ha-card { border-radius: 20px; padding: 20px; box-sizing: border-box; transition: background 0.3s ease; }

      /* OVERRIDE FOR DARK THEME */
      ha-card.force-dark {
        background: linear-gradient(145deg, #1a1a1a, #282828);
        color: white;
        --primary-text-color: #ffffff;
        --secondary-text-color: #aaaaaa;
        --secondary-background-color: rgba(0,0,0,0.2);
        --divider-color: rgba(255,255,255,0.1);
        --ha-card-box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      }
      ha-card.force-dark .glass-box { background: rgba(255, 255, 255, 0.05); }

      .card-title { font-weight: 800; font-size: 24px; color: var(--primary-text-color); padding-bottom: 5px; }
      .main-grid { display: flex; flex-direction: column; gap: 20px; margin-top: 20px; }
      .glass-box { background: transparent; padding: 15px; box-sizing: border-box; border-radius: 15px;}
      .bordered { border: 1px solid var(--divider-color); box-shadow: var(--ha-card-box-shadow, 0 4px 15px rgba(0,0,0,0.1)); }
      .flex-header { display: flex; justify-content: space-between; align-items: center; }
      .status-badge { font-size: 12px; font-weight: bold; padding: 4px 10px; border-radius: 10px; }
      div { box-sizing: border-box; }
    `;
  }
}
customElements.define("domhouse-my-contract-card", DomHouseMyContractCard);

class DomHouseMyContractCardEditor extends LitElement {
  static get properties() { return { hass: {}, _config: {} }; }
  setConfig(config) { this._config = config; }
  _valueChanged(ev) {
    if (!this._config || !this.hass) return;
    const target = ev.target;
    const configValue = target.configValue;
    if (!configValue) return;
    let newValue = ev.type === 'value-changed' ? ev.detail.value : target.value;
    if (this._config[configValue] === newValue) return;
    const newConfig = { ...this._config };
    // SE L'UTENTE PREME LA "X", ELIMINA LA CONFIGURAZIONE
    if (newValue === "" || newValue === undefined || newValue === null) delete newConfig[configValue];
    else newConfig[configValue] = newValue;
    this._config = newConfig;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
  }

  render() {
    if (!this.hass || !this._config) return html``;
    return html`
      <div class="card-config">
        <div class="vertical-inputs">
            <ha-textfield label="Titolo Card (lascia vuoto per nasconderlo)" .value=${this._config.title !== undefined ? this._config.title : '🐙 Octopus: Il Mio Contratto'} .configValue=${"title"} @input=${this._valueChanged}></ha-textfield>
            <ha-selector .hass=${this.hass} .selector=${{ select: { options: [{value: "default", label: "Segui Tema Home Assistant (Chiaro/Scuro)"}, {value: "dark", label: "Scolpito nella roccia (Scuro Fisso)"}] } }} .value=${this._config.theme_mode || 'default'} .configValue=${"theme_mode"} .label=${"Stile Sfondo Card"} @value-changed=${this._valueChanged}></ha-selector>
        </div>
        <div class="sensor-group"><h4>💡 Sensori Luce (Opzionali)</h4><div class="vertical-inputs">
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor"] } }} .value=${this._config.l_prodotto || ''} .configValue=${"l_prodotto"} .label=${"Nome Prodotto Luce"} @value-changed=${this._valueChanged}></ha-selector>
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor"] } }} .value=${this._config.l_stato || ''} .configValue=${"l_stato"} .label=${"Stato Fornitura"} @value-changed=${this._valueChanged}></ha-selector>
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor", "input_number"] } }} .value=${this._config.l_prezzo || ''} .configValue=${"l_prezzo"} .label=${"Prezzo Energia"} @value-changed=${this._valueChanged}></ha-selector>
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor", "input_number"] } }} .value=${this._config.l_pcv || ''} .configValue=${"l_pcv"} .label=${"Quota Fissa (PCV)"} @value-changed=${this._valueChanged}></ha-selector>
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor"] } }} .value=${this._config.l_fine || ''} .configValue=${"l_fine"} .label=${"Data Fine Contratto"} @value-changed=${this._valueChanged}></ha-selector>
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor"] } }} .value=${this._config.l_giorni || ''} .configValue=${"l_giorni"} .label=${"Giorni alla Scadenza"} @value-changed=${this._valueChanged}></ha-selector>
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor"] } }} .value=${this._config.l_lettura || ''} .configValue=${"l_lettura"} .label=${"Data Ultima Lettura"} @value-changed=${this._valueChanged}></ha-selector>
        </div></div>
        <div class="sensor-group"><h4>🔥 Sensori Gas (Opzionali)</h4><div class="vertical-inputs">
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor"] } }} .value=${this._config.g_prodotto || ''} .configValue=${"g_prodotto"} .label=${"Nome Prodotto Gas"} @value-changed=${this._valueChanged}></ha-selector>
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor"] } }} .value=${this._config.g_stato || ''} .configValue=${"g_stato"} .label=${"Stato Fornitura"} @value-changed=${this._valueChanged}></ha-selector>
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor", "input_number"] } }} .value=${this._config.g_prezzo || ''} .configValue=${"g_prezzo"} .label=${"Prezzo Materia"} @value-changed=${this._valueChanged}></ha-selector>
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor", "input_number"] } }} .value=${this._config.g_qvd || ''} .configValue=${"g_qvd"} .label=${"Quota Fissa (QVD)"} @value-changed=${this._valueChanged}></ha-selector>
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor"] } }} .value=${this._config.g_fine || ''} .configValue=${"g_fine"} .label=${"Data Fine Contratto"} @value-changed=${this._valueChanged}></ha-selector>
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor"] } }} .value=${this._config.g_giorni || ''} .configValue=${"g_giorni"} .label=${"Giorni alla Scadenza"} @value-changed=${this._valueChanged}></ha-selector>
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: ["sensor"] } }} .value=${this._config.g_lettura || ''} .configValue=${"g_lettura"} .label=${"Data Ultima Lettura"} @value-changed=${this._valueChanged}></ha-selector>
        </div></div>
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid var(--divider-color); text-align: center; opacity: 0.7; font-size: 0.9em;">Powered by <a href="https://www.domhouse.it" target="_blank" style="color: var(--primary-color); text-decoration: none; font-weight: bold;">DomHouse.it</a></div>
      </div>
    `;
  }
  static get styles() {
    return css`
      .card-config { padding: 10px; } h4 { margin-bottom: 10px; margin-top: 0; padding-bottom: 5px; color: var(--primary-text-color); }
      .sensor-group { background: var(--secondary-background-color); padding: 15px; border-radius: 8px; margin-top: 20px; border: 1px solid var(--divider-color); }
      .vertical-inputs { display: flex; flex-direction: column; gap: 12px; width: 100%; }
      ha-selector, ha-textfield { width: 100%; display: block; }
    `;
  }
}
customElements.define("domhouse-my-contract-card-editor", DomHouseMyContractCardEditor);

// =============================================================================
//  REGISTRAZIONE UI HOME ASSISTANT
// =============================================================================
window.customCards = window.customCards || [];

window.customCards.push({
  type: "domhouse-octopus-card",
  name: "DomHouse Octopus Card - Confronto",
  description: "Confronto intelligente tariffe Octopus vs Sito Ufficiale",
  preview: true,
  documentationURL: "https://www.domhouse.it",
});

window.customCards.push({
  type: "domhouse-my-contract-card",
  name: "DomHouse Octopus Card - Il Mio Contratto",
  description: "Dashboard Area Personale per monitorare lo stato del contratto Octopus",
  preview: true,
  documentationURL: "https://www.domhouse.it",
});
