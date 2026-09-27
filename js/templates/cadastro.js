import { html, escapeHtml } from "./engine.js";
import { loadDraft } from "../storage.js";

// Constrói o formulário já preenchido com o rascunho salvo no localStorage
// (ver js/validation.js, que grava o rascunho a cada alteração de campo).
export function cadastroTemplate() {
  const draft = loadDraft();
  const value = (field) => escapeHtml(draft[field]);
  const selected = (field, option) => (draft[field] === option ? "selected" : "");
  const checked = (field) => (draft[field] ? "checked" : "");

  return html`
    <section class="page-hero">
      <div class="container">
        <h1>Junte-se a Nós</h1>
        <p>
          Preencha o formulário abaixo e faça parte da nossa rede de
          voluntários.
        </p>
      </div>
    </section>

    <section class="form-section" aria-labelledby="form-title">
      <div class="container">
        <form id="volunteer-form" class="volunteer-form" novalidate>
          <h2 id="form-title" class="visually-hidden">
            Formulário de cadastro
          </h2>

          <!-- DADOS PESSOAIS -->
          <fieldset>
            <legend>Dados Pessoais</legend>

            <div class="form-row">
              <div class="form-group">
                <label for="nome">Nome Completo *</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  required
                  minlength="3"
                  maxlength="80"
                  placeholder="Ex: Maria da Silva"
                  autocomplete="name"
                  pattern="^[A-Za-zÀ-ÿ\\s]+$"
                  title="Apenas letras e espaços (mín. 3 caracteres)"
                  value="${value("nome")}"
                />
              </div>

              <div class="form-group">
                <label for="cpf">CPF *</label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  required
                  placeholder="000.000.000-00"
                  inputmode="numeric"
                  maxlength="14"
                  pattern="\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}"
                  title="Formato: 000.000.000-00"
                  autocomplete="off"
                  value="${value("cpf")}"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">E-mail *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="seu@email.com"
                  autocomplete="email"
                  title="Informe um e-mail válido"
                  value="${value("email")}"
                />
              </div>

              <div class="form-group">
                <label for="telefone">Telefone/Celular *</label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  required
                  placeholder="(00) 00000-0000"
                  inputmode="numeric"
                  maxlength="15"
                  pattern="\\(\\d{2}\\)\\s?\\d{4,5}-\\d{4}"
                  title="Formato: (00) 00000-0000"
                  autocomplete="tel"
                  value="${value("telefone")}"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="nascimento">Data de Nascimento *</label>
                <input
                  type="date"
                  id="nascimento"
                  name="nascimento"
                  required
                  max="2007-12-31"
                  title="Você deve ter pelo menos 18 anos"
                  value="${value("nascimento")}"
                />
              </div>

              <div class="form-group">
                <label for="cep">CEP *</label>
                <input
                  type="text"
                  id="cep"
                  name="cep"
                  required
                  placeholder="00000-000"
                  inputmode="numeric"
                  maxlength="9"
                  pattern="\\d{5}-\\d{3}"
                  title="Formato: 00000-000"
                  autocomplete="postal-code"
                  value="${value("cep")}"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="endereco">Endereço *</label>
                <input
                  type="text"
                  id="endereco"
                  name="endereco"
                  required
                  placeholder="Rua, Avenida..."
                  autocomplete="street-address"
                  value="${value("endereco")}"
                />
              </div>

              <div class="form-group">
                <label for="cidade">Cidade *</label>
                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  required
                  placeholder="Ex: São Paulo"
                  autocomplete="address-level2"
                  value="${value("cidade")}"
                />
              </div>
            </div>
          </fieldset>

          <!-- PREFERÊNCIAS -->
          <fieldset>
            <legend>Preferências de Voluntariado</legend>

            <div class="form-group">
              <label for="area">Área de Interesse *</label>
              <select id="area" name="area" required>
                <option value="">Selecione uma área...</option>
                <option value="educacao" ${selected("area", "educacao")}>Educação</option>
                <option value="alimentacao" ${selected("area", "alimentacao")}>Alimentação</option>
                <option value="saude" ${selected("area", "saude")}>Saúde</option>
                <option value="capacitacao" ${selected("area", "capacitacao")}>Capacitação Profissional</option>
                <option value="meio-ambiente" ${selected("area", "meio-ambiente")}>Meio Ambiente</option>
                <option value="cultura" ${selected("area", "cultura")}>Cultura e Arte</option>
              </select>
            </div>

            <div class="form-group">
              <label for="disponibilidade">Disponibilidade *</label>
              <select id="disponibilidade" name="disponibilidade" required>
                <option value="">Selecione...</option>
                <option value="manha" ${selected("disponibilidade", "manha")}>Manhã (8h - 12h)</option>
                <option value="tarde" ${selected("disponibilidade", "tarde")}>Tarde (13h - 17h)</option>
                <option value="noite" ${selected("disponibilidade", "noite")}>Noite (18h - 21h)</option>
                <option value="fins-semana" ${selected("disponibilidade", "fins-semana")}>Fins de Semana</option>
                <option value="flexivel" ${selected("disponibilidade", "flexivel")}>Flexível</option>
              </select>
            </div>

            <div class="form-group">
              <label for="motivacao">Por que deseja ser voluntário? (opcional)</label>
              <textarea
                id="motivacao"
                name="motivacao"
                rows="4"
                maxlength="500"
                placeholder="Conte-nos um pouco sobre sua motivação..."
              >${value("motivacao")}</textarea>
              <small class="char-count"
                ><span id="char-count">0</span>/500 caracteres</small
              >
            </div>
          </fieldset>

          <!-- TERMOS -->
          <fieldset>
            <legend>Termos</legend>
            <div class="form-group checkbox-group">
              <input type="checkbox" id="termos" name="termos" required />
              <label for="termos"
                >Li e aceito os
                <a href="#" class="link">termos de participação</a> e a
                <a href="#" class="link">política de privacidade</a>. *</label
              >
            </div>
            <div class="form-group checkbox-group">
              <input type="checkbox" id="newsletter" name="newsletter" ${checked("newsletter")} />
              <label for="newsletter"
                >Desejo receber novidades e atualizações por e-mail.</label
              >
            </div>
          </fieldset>

          <div class="form-actions">
            <button type="reset" class="btn btn-outline">Limpar</button>
            <button type="submit" class="btn btn-primary">
              Enviar Cadastro
            </button>
          </div>

          <!-- Feedback -->
          <div
            id="form-feedback"
            class="form-feedback"
            role="alert"
          ></div>
        </form>
      </div>
    </section>
  `;
}
