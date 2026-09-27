// Ponto de entrada da SPA: liga o cabeçalho (menu/hambúrguer, fixo em todas
// as rotas) e inicializa o roteador, que renderiza a view correspondente à
// URL atual dentro de #app-view.
import { mountNav } from "./nav.js";
import { initRouter } from "./router.js";

mountNav();
initRouter();
