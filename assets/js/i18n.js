// assets/js/i18n.js
// Gestore traduzioni multilingua per Il Custode

window.i18n = (function () {
  let currentLang = "it"; // Lingua di default
  let translations = {};

  // Dizionario iniziale (puoi estenderlo con altri file in futuro)
  const baseTranslations = {
    it: {
      home: {
        wizard_title: "Il Custode ti osserva"
      },
      welcome: {
        page_title: "Il Custode — Benvenuto",
        enter: "Entra",
        greetings: [
          "Benvenuto viaggiatore, la tua storia sta per cominciare.",
          "Il Custode osserva silenzioso ogni tua scelta.",
          "Oltre questa soglia si cela un mondo di leggende.",
          "Il destino è un dado che sta per essere lanciato.",
          "Solo chi osa entrare potrà scoprire i segreti dell’avventura.",
          "La pergamena attende di essere scritta dalle tue gesta.",
          "Ogni eroe ha bisogno di un Custode… e tu ne hai trovato uno.",
          "La fiamma dell’immaginazione è pronta ad ardere ancora.",
          "Che tu sia Master o viaggiatore, il Custode ti guiderà.",
          "Nessun cammino è tracciato: sarai tu a scrivere la tua leggenda."
        ]
      }
    },
    en: {
      home: {
        wizard_title: "The Keeper is watching you"
      },
      welcome: {
        page_title: "The Keeper — Welcome",
        enter: "Enter",
        greetings: [
          "Welcome traveler, your story is about to begin.",
          "The Keeper silently watches every choice you make.",
          "Beyond this threshold lies a world of legends.",
          "Fate is a die waiting to be rolled.",
          "Only those who dare may uncover the secrets of adventure.",
          "The scroll awaits to be written by your deeds.",
          "Every hero needs a Keeper… and you have found one.",
          "The flame of imagination is ready to burn again.",
          "Whether Master or traveler, the Keeper will guide you.",
          "No path is set: you will write your own legend."
        ]
      }
    }
    // ⚠️ Qui potremo aggiungere DE, FR, ES, ecc. poco alla volta.
  };

  translations = baseTranslations;

  function t(key) {
    const parts = key.split(".");
    let val = translations[currentLang];
    for (const p of parts) {
      if (!val) return key;
      val = val[p];
    }
    return val || key;
  }

  function pick(key) {
    const arr = t(key);
    if (Array.isArray(arr)) {
      const idx = Math.floor(Math.random() * arr.length);
      return arr[idx];
    }
    return arr;
  }

  function apply(root = document) {
    root.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const val = t(key);
      if (val && !Array.isArray(val)) el.textContent = val;
    });

    root.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = t(key);
      if (val && !Array.isArray(val)) el.setAttribute("placeholder", val);
    });
  }

  function setLang(lang) {
    if (translations[lang]) {
      currentLang = lang;
      apply();
      window.dispatchEvent(new Event("i18n:change"));
    }
  }

  return { t, pick, apply, setLang };
})();
