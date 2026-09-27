import { homeTemplate } from "./templates/home.js";
import { projetosTemplate } from "./templates/projetos.js";
import { cadastroTemplate } from "./templates/cadastro.js";
import { naoEncontradaTemplate } from "./templates/nao-encontrada.js";
import { mountCadastroForm } from "./validation.js";
import { setActiveNavLink } from "./nav.js";

// Rotas registradas: caminho, título/descrição de aba, template (função que
// devolve HTML) e uma função opcional de "mount" para ligar eventos no
// conteúdo recém-inserido no DOM (o template só entrega HTML estático).
const routes = [
  {
    path: "/",
    title: "Mãos que Ajudam | Início",
    description:
      "ONG Mãos que Ajudam - Transformando vidas através da solidariedade e do voluntariado.",
    template: homeTemplate,
  },
  {
    path: "/projetos",
    title: "Projetos | Mãos que Ajudam",
    description:
      "Conheça os projetos sociais da ONG Mãos que Ajudam: educação, alimentação e capacitação.",
    template: projetosTemplate,
  },
  {
    path: "/cadastro",
    title: "Cadastro de Voluntário | Mãos que Ajudam",
    description:
      "Cadastre-se como voluntário da ONG Mãos que Ajudam e transforme vidas.",
    template: cadastroTemplate,
    mount: mountCadastroForm,
  },
];

const notFoundRoute = {
  path: null,
  title: "Página não encontrada | Mãos que Ajudam",
  description: "O endereço acessado não existe no site da ONG Mãos que Ajudam.",
  template: naoEncontradaTemplate,
};

function currentPath() {
  const raw = window.location.hash.replace(/^#/, "");
  return raw.startsWith("/") ? raw : "/";
}

function matchRoute(path) {
  const base = "/" + (path.split("/")[1] || "");
  return routes.find((route) => route.path === base) || notFoundRoute;
}

// Trocar o innerHTML não reinicia uma animação CSS já executada; remover a
// classe, forçar um reflow e reaplicá-la faz o fade rodar a cada troca de view.
function playEnterAnimation(el) {
  el.classList.remove("view-enter");
  void el.offsetWidth;
  el.classList.add("view-enter");
}

function updateMetaDescription(text) {
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", text);
}

function highlightAnchor(anchorId) {
  const target = document.getElementById(anchorId);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  target.classList.add("is-highlighted");
  setTimeout(() => target.classList.remove("is-highlighted"), 1600);
}

function render() {
  const path = currentPath();
  const route = matchRoute(path);
  const anchorId = path.split("/")[2];
  const appView = document.getElementById("app-view");

  document.title = route.title;
  updateMetaDescription(route.description);
  appView.innerHTML = route.template();
  playEnterAnimation(appView);
  setActiveNavLink(route.path);

  if (typeof route.mount === "function") route.mount();

  if (anchorId) {
    highlightAnchor(anchorId);
  } else {
    window.scrollTo({ top: 0 });
  }

  // Move o foco para o conteúdo recém-renderizado, para que leitores de tela
  // anunciem a troca de "página" mesmo sem recarregar o documento.
  // preventScroll: sem isso o foco rola a página até o topo do <main> e
  // interrompe a rolagem suave até o card do submenu.
  appView.focus({ preventScroll: true });
}

export function initRouter() {
  window.addEventListener("hashchange", render);
  render();
}
