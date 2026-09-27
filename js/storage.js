// Camada de acesso ao localStorage. Concentra aqui toda leitura/escrita para
// que o resto do app nunca chame localStorage diretamente nem precise repetir
// o try/catch (o armazenamento pode falhar em navegação privada, cota
// excedida etc.).
const PREFIX = "maosqueajudam:";
const DRAFT_KEY = PREFIX + "cadastro-rascunho";
const SUBMISSIONS_KEY = PREFIX + "voluntarios";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Armazenamento indisponível: o app continua funcionando sem persistência.
  }
}

export function loadDraft() {
  return readJSON(DRAFT_KEY, {});
}

export function saveDraft(data) {
  writeJSON(DRAFT_KEY, data);
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* nada a fazer */
  }
}

export function getSubmissions() {
  return readJSON(SUBMISSIONS_KEY, []);
}

export function addSubmission(data) {
  const list = getSubmissions();
  list.push({ ...data, enviadoEm: new Date().toISOString() });
  writeJSON(SUBMISSIONS_KEY, list);
  return list.length;
}
