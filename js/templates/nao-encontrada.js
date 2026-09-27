import { html } from "./engine.js";

export function naoEncontradaTemplate() {
  return html`
    <section class="page-hero">
      <div class="container">
        <h1>Página não encontrada</h1>
        <p>O endereço acessado não existe ou foi movido.</p>
      </div>
    </section>

    <section class="cta">
      <div class="container cta-content">
        <h2>Vamos continuar?</h2>
        <p>Volte para a página inicial ou conheça nossos projetos.</p>
        <a href="#/" class="btn btn-primary">Ir para o início</a>
      </div>
    </section>
  `;
}
