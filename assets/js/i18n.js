// assets/js/i18n.js
// Mini i18n con: setLang, getLang, t, pick, apply, fallback IT.
// File attesi: assets/i18n/<lang>.json  (es. it.json, en.json ...)

(function () {
  const I18N_PATH = "assets/i18n";
  const DEFAULT_LANG = "it";

  const i18n = {
    data: {},
    lang: null,

    async load(lang) {
      const code = (lang || "").trim() || DEFAULT_LANG;
      // Se già caricata, non ricaricare
      if (this.lang === code && this.data[code]) return;

      // Prova a caricare la lingua richiesta
      try {
        const res = await fetch(`${I18N_PATH}/${code}.json`, { cache: "no-store" });
        if (!res.ok) throw new Error("not ok");
        this.data[code] = await res.json();
        this.lang = code;
      } catch {
        // Fallback all'italiano
        if (code !== DEFAULT_LANG) {
          await this.load(DEFAULT_LANG);
          this.lang = DEFAULT_LANG;
        } else {
          this.data[DEFAULT_LANG] = this.data[DEFAULT_LANG] || {};
          this.lang = DEFAULT_LANG;
        }
      }
      // Notifica alle pagine che la lingua è pronta/cambiata
      window.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang: this.lang } }));
    },

    setLang(lang) { return this.load(lang); },
    getLang() { return this.lang || DEFAULT_LANG; },

    // Ritorna il valore per una chiave a.notazione.puntata, o la chiave stessa se mancante
    t(key) {
      const lang = this.getLang();
      let cur = this.data[lang] || {};
      for (const part of key.split(".")) {
        if (cur && typeof cur === "object" && part in cur) cur = cur[part];
        else return key; // fallback: mostra la chiave grezza
      }
      return (typeof cur === "string") ? cur : key;
    },

    // Pesca a caso da un array di stringhe alla chiave indicata
    pick(key) {
      const lang = this.getLang();
      let cur = this.data[lang] || {};
      for (const part of key.split(".")) {
        if (cur && typeof cur === "object" && part in cur) cur = cur[part];
        else return ""; // niente
      }
      if (Array.isArray(cur) && cur.length) {
        const i = Math.floor(Math.random() * cur.length);
        return cur[i];
      }
      return "";
    },

    // Applica tutti gli elementi con data-i18n / data-i18n-placeholder
    apply(root) {
      const scope = root || document;
      scope.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        const val = this.t(key);
        if (val && val !== key) el.textContent = val;
      });
      scope.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        const val = this.t(key);
        if (val && val !== key) el.setAttribute("placeholder", val);
      });
    }
  };

  // Espone globalmente
  window.i18n = i18n;

  // Lingua iniziale: prova da localStorage, altrimenti IT
  const saved = localStorage.getItem("app.lang") || DEFAULT_LANG;
  i18n.load(saved);
})();
