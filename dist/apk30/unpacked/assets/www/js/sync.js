(function () {
  const SYNC_SINCE_KEY = "bba_sync_since";
  const SYNC_LAST_STATUS_KEY = "bba_sync_last_status";
  const SYNC_PENDING_DELETES_KEY = "bba_sync_pending_deletes";

  const ENTITY_DEFS = [
    {
      type: "usuarios",
      storageKey: "bba_usuarios",
      listFn: () => (typeof listarUsuarios === "function" ? listarUsuarios() : []),
      saveFn: (lista) => {
        if (typeof salvarUsuarios === "function") salvarUsuarios(lista);
      },
    },
    {
      type: "vistorias",
      storageKey: "bba_vistorias",
      listFn: () => (typeof listarVistorias === "function" ? listarVistorias() : []),
      saveFn: (lista) => {
        if (typeof salvarVistorias === "function") salvarVistorias(lista);
      },
    },
    {
      type: "vistorias_viaturas",
      storageKey: "bba_vistorias_viaturas",
      listFn: () =>
        typeof listarVistoriasViaturas === "function" ? listarVistoriasViaturas() : [],
      saveFn: (lista) => {
        if (typeof salvarVistoriasViaturas === "function") salvarVistoriasViaturas(lista);
      },
    },
    {
      type: "cadastro_viaturas",
      storageKey: "bba_cadastro_viaturas",
      listFn: () =>
        typeof listarCadastroViaturas === "function" ? listarCadastroViaturas() : [],
      saveFn: (lista) => {
        if (typeof salvarCadastroViaturas === "function") salvarCadastroViaturas(lista);
      },
    },
  ];

  function getStoredSyncConfig() {
    try {
      return JSON.parse(localStorage.getItem(SYNC_CONFIG_STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveSyncConfig(url, anonKey) {
    localStorage.setItem(
      SYNC_CONFIG_STORAGE_KEY,
      JSON.stringify({ url: String(url || "").trim(), anonKey: String(anonKey || "").trim() })
    );
  }

  function getSyncConfig() {
    const stored = getStoredSyncConfig();
    const defaults =
      typeof getSyncConfigDefaults === "function" ? getSyncConfigDefaults() : {};
    return {
      url: stored.url || defaults.url || "",
      anonKey: stored.anonKey || defaults.anonKey || "",
    };
  }

  function isSyncConfigured() {
    const cfg = getSyncConfig();
    return Boolean(cfg.url && cfg.anonKey);
  }

  function getSyncSince() {
    return localStorage.getItem(SYNC_SINCE_KEY) || "1970-01-01T00:00:00.000Z";
  }

  function setSyncSince(iso) {
    localStorage.setItem(SYNC_SINCE_KEY, iso);
  }

  function getLastSyncStatus() {
    try {
      return JSON.parse(localStorage.getItem(SYNC_LAST_STATUS_KEY) || "null");
    } catch {
      return null;
    }
  }

  function setLastSyncStatus(status) {
    localStorage.setItem(SYNC_LAST_STATUS_KEY, JSON.stringify(status));
  }

  function getPendingDeletes() {
    try {
      return JSON.parse(localStorage.getItem(SYNC_PENDING_DELETES_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function setPendingDeletes(lista) {
    localStorage.setItem(SYNC_PENDING_DELETES_KEY, JSON.stringify(lista));
  }

  function marcarExclusaoSync(entityType, item) {
    if (!item?.sync_id) return;
    const pending = getPendingDeletes();
    pending.push({
      sync_id: item.sync_id,
      entity_type: entityType,
      updated_at: new Date().toISOString(),
    });
    setPendingDeletes(pending);
  }

  function payloadForSync(entityType, item) {
    if (!item || typeof item !== "object") return item;
    if (entityType === "vistorias") {
      const copia = { ...item };
      const fotos = Array.isArray(copia.fotos) ? copia.fotos : [];
      copia.fotos = fotos
        .map((f) => (typeof metadadosFoto === "function" ? metadadosFoto(f) : null))
        .filter(Boolean);
      return copia;
    }
    return item;
  }

  function ensureSyncMetaOnList(lista) {
    return lista.map((item) => {
      if (typeof touchSyncMeta === "function") return touchSyncMeta({ ...item });
      if (!item.sync_id && typeof gerarSyncId === "function") {
        item.sync_id = gerarSyncId();
      }
      item.updated_at = item.updated_at || new Date().toISOString();
      return item;
    });
  }

  async function prepararFotosAntesDoPush(cfg) {
    if (typeof prepararFotosVistoriaParaPush !== "function") {
      return { falhas: 0 };
    }
    const def = ENTITY_DEFS.find((d) => d.type === "vistorias");
    if (!def) return { falhas: 0 };
    let lista = ensureSyncMetaOnList(def.listFn());
    let falhas = 0;
    let alterou = false;
    for (let i = 0; i < lista.length; i++) {
      const item = lista[i];
      if (!item?.sync_id) continue;
      if (!Array.isArray(item.fotos) || !item.fotos.length) continue;
      const precisaUpload = item.fotos.some(
        (f) => f?.data && String(f.data).startsWith("data:") && !f.storage_path
      );
      const precisaReupload = item.fotos.some(
        (f) => f?.data && String(f.data).startsWith("data:") && f.storage_path && !f._synced
      );
      if (!precisaUpload && !precisaReupload) {
        // Garante metadados se já tem path
        continue;
      }
      const prep = await prepararFotosVistoriaParaPush(cfg, item);
      falhas += prep.falhas || 0;
      lista[i] = { ...item, fotos: prep.fotosLocais };
      alterou = true;
    }
    if (alterou) def.saveFn(lista);
    return { falhas };
  }

  function coletarRegistrosLocais() {
    const registros = [];
    for (const def of ENTITY_DEFS) {
      const lista = ensureSyncMetaOnList(def.listFn());
      for (const item of lista) {
        if (!item.sync_id) continue;
        registros.push({
          sync_id: item.sync_id,
          entity_type: def.type,
          payload: payloadForSync(def.type, item),
          updated_at: item.updated_at || new Date().toISOString(),
          device_id: getDeviceId(),
          deleted: item.ativo === false,
        });
      }
    }
    for (const del of getPendingDeletes()) {
      registros.push({
        sync_id: del.sync_id,
        entity_type: del.entity_type,
        payload: { sync_id: del.sync_id },
        updated_at: del.updated_at,
        device_id: getDeviceId(),
        deleted: true,
      });
    }
    return registros;
  }

  function supabaseHeaders(cfg) {
    return {
      apikey: cfg.anonKey,
      Authorization: `Bearer ${cfg.anonKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    };
  }

  async function pushRegistros(cfg, registros) {
    if (!registros.length) return 0;
    const resp = await fetch(`${cfg.url.replace(/\/$/, "")}/rest/v1/bba_sync`, {
      method: "POST",
      headers: supabaseHeaders(cfg),
      body: JSON.stringify(registros),
    });
    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Push falhou (${resp.status}): ${txt.slice(0, 200)}`);
    }
    return registros.length;
  }

  async function pullRegistros(cfg, since) {
    const base = cfg.url.replace(/\/$/, "");
    const url =
      `${base}/rest/v1/bba_sync?updated_at=gt.${encodeURIComponent(since)}` +
      "&order=updated_at.asc&select=sync_id,entity_type,payload,updated_at,device_id,deleted";
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        apikey: cfg.anonKey,
        Authorization: `Bearer ${cfg.anonKey}`,
      },
    });
    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Pull falhou (${resp.status}): ${txt.slice(0, 200)}`);
    }
    return resp.json();
  }

  function mergeRemotoNaLista(lista, remoto) {
    const syncId = remoto.sync_id;
    const payload = remoto.payload || {};
    if (remoto.deleted) {
      return lista.filter((item) => item.sync_id !== syncId);
    }
    const idx = lista.findIndex((item) => item.sync_id === syncId);
    const remotoTime = parseSyncTime(remoto.updated_at || payload.updated_at);
    if (idx === -1) {
      lista.push({
        ...payload,
        sync_id: syncId,
        updated_at: remoto.updated_at || payload.updated_at,
      });
      return lista;
    }
    const localTime = parseSyncTime(lista[idx].updated_at);
    if (remotoTime >= localTime) {
      const anterior = lista[idx];
      lista[idx] = {
        ...lista[idx],
        ...payload,
        sync_id: syncId,
        updated_at: remoto.updated_at || payload.updated_at,
        // Preserva fotos locais até hidratação (evita apagar data:)
        fotos: payload.fotos || lista[idx].fotos,
        _anterior_fotos: anterior.fotos,
      };
    }
    return lista;
  }

  function aplicarPull(remotos) {
    const porTipo = {};
    for (const remoto of remotos) {
      if (!remoto?.entity_type) continue;
      if (!porTipo[remoto.entity_type]) porTipo[remoto.entity_type] = [];
      porTipo[remoto.entity_type].push(remoto);
    }

    for (const def of ENTITY_DEFS) {
      const remotosTipo = porTipo[def.type] || [];
      if (!remotosTipo.length) continue;
      let lista = def.listFn();
      for (const remoto of remotosTipo) {
        lista = mergeRemotoNaLista(lista, remoto);
      }
      def.saveFn(lista);
    }
  }

  async function hidratarFotosAposPull(cfg) {
    if (typeof hidratarFotosVistoriaDoPull !== "function") {
      return { falhas: 0 };
    }
    const def = ENTITY_DEFS.find((d) => d.type === "vistorias");
    if (!def) return { falhas: 0 };
    let lista = def.listFn();
    let falhas = 0;
    let alterou = false;
    for (let i = 0; i < lista.length; i++) {
      const item = lista[i];
      const fotos = item?.fotos;
      if (!Array.isArray(fotos) || !fotos.length) continue;
      const precisa = fotos.some((f) => f?.storage_path && !f?.data);
      const temAnterior = Array.isArray(item._anterior_fotos);
      if (!precisa && !temAnterior) continue;
      const anterior = { fotos: item._anterior_fotos || item.fotos };
      const result = await hidratarFotosVistoriaDoPull(cfg, item, anterior);
      falhas += result.falhas || 0;
      const { _anterior_fotos, ...resto } = result.vistoria || item;
      lista[i] = resto;
      alterou = true;
    }
    if (alterou) def.saveFn(lista);
    return { falhas };
  }

  async function sincronizar(opts = {}) {
    const silencioso = Boolean(opts.silencioso);
    if (!navigator.onLine) {
      const err = { ok: false, erro: "Sem conexão com a internet." };
      if (!silencioso) setLastSyncStatus(err);
      return err;
    }
    if (!isSyncConfigured()) {
      const err = { ok: false, erro: "Supabase não configurado." };
      if (!silencioso) setLastSyncStatus(err);
      return err;
    }

    const cfg = getSyncConfig();
    const since = getSyncSince();
    let enviados = 0;
    let recebidos = 0;
    let fotosFalhas = 0;

    try {
      const prep = await prepararFotosAntesDoPush(cfg);
      fotosFalhas += prep.falhas || 0;

      const locais = coletarRegistrosLocais();
      enviados = await pushRegistros(cfg, locais);

      const remotos = await pullRegistros(cfg, since);
      recebidos = remotos.length;
      if (recebidos) aplicarPull(remotos);

      const hidr = await hidratarFotosAposPull(cfg);
      fotosFalhas += hidr.falhas || 0;

      const agora = new Date().toISOString();
      setSyncSince(agora);
      setPendingDeletes([]);

      const status = {
        ok: true,
        enviados,
        recebidos,
        fotos_pendentes: fotosFalhas,
        quando: agora,
      };
      setLastSyncStatus(status);
      return status;
    } catch (e) {
      const err = { ok: false, erro: e.message || String(e), quando: new Date().toISOString() };
      setLastSyncStatus(err);
      return err;
    }
  }

  window.getSyncConfig = getSyncConfig;
  window.saveSyncConfig = saveSyncConfig;
  window.isSyncConfigured = isSyncConfigured;
  window.getLastSyncStatus = getLastSyncStatus;
  window.marcarExclusaoSync = marcarExclusaoSync;
  window.sincronizar = sincronizar;
})();
