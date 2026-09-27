// Menu hambúrguer + submenu "Projetos" e sincronização do link ativo.
// O cabeçalho é estático (vive no shell da SPA, fora da área trocada pelo
// router), então isso só precisa ser ligado uma vez, no carregamento.
export function mountNav() {
  const toggle = document.getElementById("nav-toggle");
  const navList = document.getElementById("nav-list");
  if (!toggle || !navList) return;

  toggle.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  navList.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navList.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Marca como ativo o link de topo (Início/Projetos/Seja Voluntário) cujo
// data-route bate com a rota atual, e limpa os demais.
export function setActiveNavLink(routePath) {
  document.querySelectorAll("#nav-list > li > a[data-route]").forEach((link) => {
    const isActive = link.getAttribute("data-route") === routePath;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}
