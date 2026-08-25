const DEVICE_ID_KEY = "bba_device_id";

function gerarSyncId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = gerarSyncId();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

function touchSyncMeta(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (!obj.sync_id) obj.sync_id = gerarSyncId();
  obj.updated_at = new Date().toISOString();
  return obj;
}

function parseSyncTime(valor) {
  if (!valor) return 0;
  const t = Date.parse(String(valor));
  return Number.isNaN(t) ? 0 : t;
}
