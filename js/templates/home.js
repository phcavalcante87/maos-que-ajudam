import { html } from "./engine.js";

export function homeTemplate() {
  return html`
    <section class="hero" aria-labelledby="hero-title">
      <div class="container hero-content">
        <h1 id="hero-title">Pequenas mãos, grandes transformações</h1>
        <p>
          Somos uma organização sem fins lucrativos dedicada a promover
          dignidade, educação e oportunidades para comunidades em situação de
          vulnerabilidade.
        </p>
        <div class="hero-actions">
          <a href="#/cadastro" class="btn btn-primary">Quero Ser Voluntário</a>
          <a href="#/projetos" class="btn btn-outline">Conhecer Projetos</a>
        </div>
      </div>
    </section>

    <section class="about" aria-labelledby="about-title">
      <div class="container">
        <header class="section-header">
          <h2 id="about-title">Nossa Missão</h2>
          <p>
            Transformar realidades através da solidariedade organizada e do
            engajamento comunitário.
          </p>
        </header>
        <img
          src="../img/equipe-voluntarios.webp"
          alt="Vista de cima de uma equipe de voluntários unindo os punhos sobre uma mesa de trabalho com notebooks e cadernos, em sinal de cooperação"
          class="about-image"
          width="1024"
          height="490"
          loading="lazy"
        />
        <div class="cards-grid">
          <article class="card">
            <div class="card-icon" aria-hidden="true">🎯</div>
            <h3>Propósito</h3>
            <p>
              Combater a desigualdade social oferecendo apoio educacional,
              alimentar e emocional.
            </p>
          </article>
          <article class="card">
            <div class="card-icon" aria-hidden="true">💚</div>
            <h3>Valores</h3>
            <p>
              Empatia, transparência, respeito à diversidade e compromisso com
              resultados reais.
            </p>
          </article>
          <article class="card">
            <div class="card-icon" aria-hidden="true">🌍</div>
            <h3>Impacto</h3>
            <p>
              Mais de 5.000 famílias atendidas em 12 comunidades nos últimos 5
              anos.
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="stats" aria-labelledby="stats-title">
      <div class="container">
        <h2 id="stats-title" class="visually-hidden">Números da ONG</h2>
        <dl class="stats-grid">
          <div class="stat">
            <dt>Famílias atendidas</dt>
            <dd>5.200+</dd>
          </div>
          <div class="stat">
            <dt>Voluntários ativos</dt>
            <dd>340</dd>
          </div>
          <div class="stat">
            <dt>Projetos em andamento</dt>
            <dd>18</dd>
          </div>
          <div class="stat">
            <dt>Anos de atuação</dt>
            <dd>12</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="cta" aria-labelledby="cta-title">
      <div class="container cta-content">
        <h2 id="cta-title">Faça parte dessa transformação</h2>
        <p>
          Seu tempo e talento podem mudar vidas. Cadastre-se como voluntário e
          comece hoje.
        </p>
        <a href="#/cadastro" class="btn btn-primary">Cadastrar Agora</a>
      </div>
    </section>
  `;
}
