const UPDATE_CONFIG_STORAGE_KEY = "bba_update_config";

function getUpdateConfigDefaults() {
  return {
    githubRepo: typeof GITHUB_REPO_DEFAULT === "string" ? GITHUB_REPO_DEFAULT : "",
  };
}

function getUpdateConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(UPDATE_CONFIG_STORAGE_KEY) || "{}");
    return { ...getUpdateConfigDefaults(), ...saved };
  } catch {
    return getUpdateConfigDefaults();
  }
}

function saveUpdateConfig(githubRepo) {
  localStorage.setItem(
    UPDATE_CONFIG_STORAGE_KEY,
    JSON.stringify({ githubRepo: String(githubRepo || "").trim() })
  );
}

function getUpdateRepo() {
  const cfg = getUpdateConfig();
  return String(cfg.githubRepo || "").trim();
}
