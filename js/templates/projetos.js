import { html } from "./engine.js";
import { projetos } from "../data/projetos.js";

function projectCard(projeto) {
  return html`
    <article class="project-card" id="${projeto.id}">
      <div class="project-badge">${projeto.categoria}</div>
      <h3>${projeto.titulo}</h3>
      <p>${projeto.descricao}</p>
      <ul class="project-meta">
        ${projeto.meta.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </article>
  `;
}

export function projetosTemplate() {
  return html`
    <section class="page-hero">
      <div class="container">
        <h1>Nossas Iniciativas Solidárias</h1>
        <p>
          Conheça os projetos que transformam comunidades e geram impacto
          social real.
        </p>
      </div>
    </section>

    <section class="projects" aria-labelledby="projects-title">
      <div class="container">
        <h2 id="projects-title" class="visually-hidden">Lista de projetos</h2>
        <div class="projects-grid">${projetos.map(projectCard)}</div>
      </div>
    </section>

    <section class="cta">
      <div class="container cta-content">
        <h2>Quer apoiar algum projeto?</h2>
        <p>
          Seja como voluntário ou doador, sua contribuição faz a diferença.
        </p>
        <a href="#/cadastro" class="btn btn-primary">Quero Ajudar</a>
      </div>
    </section>
  `;
}
