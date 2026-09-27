// Sistema de templates: template literals marcadas (tagged templates) que
// concatenam strings e valores em um único HTML, aceitando arrays (uma lista
// de itens já renderizados) e ignorando valores nulos/indefinidos.
export function html(strings, ...values) {
  return strings.reduce((out, str, i) => {
    const value = values[i];
    const piece = Array.isArray(value) ? value.join("") : (value ?? "");
    return out + str + piece;
  }, "");
}

// Escapa texto vindo de dados (ex.: rascunho salvo no localStorage) antes de
// injetá-lo como atributo ou conteúdo HTML, evitando quebrar o template ou
// abrir espaço para HTML/script indesejado.
export function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (ch) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[ch],
  );
}
