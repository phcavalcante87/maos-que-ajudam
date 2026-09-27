// Carregado no <head> para aplicar o tema antes da página aparecer (evita o "flash").
(function () {
  var STORAGE_KEY = "theme";
  var root = document.documentElement;

  function readSaved() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function save(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* armazenamento indisponível: o tema vale só nesta visita */
    }
  }

  function preferredTheme() {
    var saved = readSaved();
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var button = document.getElementById("theme-toggle");
    if (button) {
      button.setAttribute(
        "aria-label",
        theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro",
      );
    }
  }

  applyTheme(preferredTheme());

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(root.getAttribute("data-theme"));
    var button = document.getElementById("theme-toggle");
    if (!button) return;
    button.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      save(next);
    });
  });
})();
