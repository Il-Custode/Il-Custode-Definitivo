// assets/js/supabase-singleton.js
// Carica la libreria Supabase (CDN) una sola volta e crea un client unico riutilizzabile.
// Uso in pagina: 
//   <script src="assets/js/env.supabase.js"></script>
//   <script src="assets/js/supabase-singleton.js"></script>
//   <script>
//     getSupabase().then(async (supabase) => {
//       const { data, error } = await supabase.auth.getSession();
//       console.log('Supabase OK:', !!supabase, 'Session error:', error || null);
//     });
//   </script>

(function () {
  const SUPABASE_CDN = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js";

  let _clientPromise = null;
  let _cdnPromise = null;

  function loadCdnOnce() {
    if (_cdnPromise) return _cdnPromise;
    _cdnPromise = new Promise((resolve, reject) => {
      if (window.supabase) return resolve(); // già caricato
      const script = document.createElement("script");
      script.src = SUPABASE_CDN;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Impossibile caricare la libreria Supabase dal CDN."));
      document.head.appendChild(script);
    });
    return _cdnPromise;
  }

  async function createClientOnce() {
    if (_clientPromise) return _clientPromise;

    _clientPromise = (async () => {
      await loadCdnOnce();

      const env = (window.ENV || {});
      const url = env.SUPABASE_URL;
      const anon = env.SUPABASE_ANON_KEY;

      if (!url || !anon) {
        throw new Error("Mancano SUPABASE_URL o SUPABASE_ANON_KEY. Controlla assets/js/env.supabase.js");
      }

      // window.supabase è esposto dalla build UMD del CDN
      const client = window.supabase.createClient(url, anon);
      return client;
    })();

    return _clientPromise;
  }

  // Espone una funzione globale semplice da usare nelle pagine
  window.getSupabase = function () {
    return createClientOnce();
  };
})();
