import { saveDraft, clearDraft, addSubmission } from "./storage.js";

// Campos persistidos como rascunho. "termos" fica de fora de propósito: o
// aceite dos termos deve ser reafirmado a cada preenchimento, não vir
// pré-marcado de uma visita anterior.
const DRAFT_FIELDS = [
  "nome",
  "cpf",
  "email",
  "telefone",
  "nascimento",
  "cep",
  "endereco",
  "cidade",
  "area",
  "disponibilidade",
  "motivacao",
  "newsletter",
];

function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

function maskCpf(value) {
  const d = onlyDigits(value).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

function maskTelefone(value) {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return "(" + d;
  const split = d.length > 10 ? 7 : 6; // celular: 5+4 dígitos, fixo: 4+4
  if (d.length <= split) return "(" + d.slice(0, 2) + ") " + d.slice(2);
  return "(" + d.slice(0, 2) + ") " + d.slice(2, split) + "-" + d.slice(split);
}

function maskCep(value) {
  const d = onlyDigits(value).slice(0, 8);
  return d.replace(/^(\d{5})(\d)/, "$1-$2");
}

function isValidCpf(cpf) {
  const d = onlyDigits(cpf);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  for (let len = 9; len <= 10; len++) {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(d[i]) * (len + 1 - i);
    const check = ((sum * 10) % 11) % 10;
    if (check !== Number(d[len])) return false;
  }
  return true;
}

export function mountCadastroForm() {
  const form = document.getElementById("volunteer-form");
  if (!form) return;

  const feedback = document.getElementById("form-feedback");
  const counter = document.getElementById("char-count");
  const motivacao = document.getElementById("motivacao");
  const cpfInput = document.getElementById("cpf");
  const nascimento = document.getElementById("nascimento");

  function applyMask(id, mask) {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("input", () => {
      input.value = mask(input.value);
    });
  }

  function validateCpf() {
    // Só acrescenta o erro de dígito verificador quando o formato já está
    // completo; antes disso, o `pattern` do HTML cuida da mensagem.
    const complete = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpfInput.value);
    cpfInput.setCustomValidity(
      complete && !isValidCpf(cpfInput.value) ? "CPF inválido" : "",
    );
  }

  // Maioridade: a data máxima é hoje menos 18 anos (o `max` do HTML é fixo).
  function setMaxBirthDate() {
    const limit = new Date();
    limit.setFullYear(limit.getFullYear() - 18);
    const month = String(limit.getMonth() + 1).padStart(2, "0");
    const day = String(limit.getDate()).padStart(2, "0");
    nascimento.max = `${limit.getFullYear()}-${month}-${day}`;
  }

  function updateCounter() {
    counter.textContent = motivacao.value.length;
  }

  function showFeedback(type, message) {
    feedback.className = "form-feedback " + type;
    feedback.textContent = message;
  }

  function clearFeedback() {
    feedback.className = "form-feedback";
    feedback.textContent = "";
  }

  function fieldName(field) {
    if (field.type === "checkbox") return "Aceite dos termos";
    const label = form.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent.replace(/\s*\*\s*$/, "").trim() : field.name;
  }

  // ----- Rascunho (localStorage) -----
  function persistDraft() {
    const draft = {};
    DRAFT_FIELDS.forEach((name) => {
      const field = form.elements[name];
      if (!field) return;
      draft[name] = field.type === "checkbox" ? field.checked : field.value;
    });
    saveDraft(draft);
  }

  // ----- aria-invalid (leitores de tela) -----
  // Espelha a mesma regra visual do CSS (:invalid:not(:placeholder-shown)):
  // só marca erro depois que o campo recebeu algum conteúdo, para não soar
  // como "inválido" um campo obrigatório que o usuário ainda nem tocou.
  function syncAriaInvalid(field) {
    if (!field.willValidate) return;
    const hasContent = field.type === "checkbox" || field.value.trim() !== "";
    if (hasContent && !field.validity.valid) {
      field.setAttribute("aria-invalid", "true");
    } else {
      field.removeAttribute("aria-invalid");
    }
  }

  function syncAllAriaInvalid() {
    Array.prototype.forEach.call(form.elements, syncAriaInvalid);
  }

  form.addEventListener("input", persistDraft);
  form.addEventListener("change", persistDraft);
  form.addEventListener("input", syncAllAriaInvalid);
  form.addEventListener("change", syncAllAriaInvalid);

  // Os links de termos/privacidade ainda não têm página própria. Com roteamento
  // por hash, href="#" apontaria para a rota vazia e tiraria o usuário do
  // formulário, então o clique é bloqueado.
  form.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
  });

  // ----- Eventos -----
  applyMask("cpf", maskCpf);
  applyMask("telefone", maskTelefone);
  applyMask("cep", maskCep);

  cpfInput.addEventListener("input", validateCpf);
  motivacao.addEventListener("input", updateCounter);
  setMaxBirthDate();
  updateCounter();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    validateCpf();

    if (!form.checkValidity()) {
      // form.elements evita contar o <fieldset>, que também casa com :invalid
      const invalid = Array.prototype.filter.call(
        form.elements,
        (el) => el.willValidate && !el.validity.valid,
      );
      // No envio, marca até os campos obrigatórios vazios (syncAllAriaInvalid
      // sozinho não os marcaria, pois exige conteúdo digitado).
      invalid.forEach((field) => field.setAttribute("aria-invalid", "true"));
      showFeedback(
        "error",
        "Revise os campos: " + invalid.map(fieldName).join(", ") + ".",
      );
      invalid[0].focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    const firstName = data.nome.trim().split(/\s+/)[0];
    const total = addSubmission(data);
    clearDraft();
    form.reset(); // dispara o evento "reset", que limpa o feedback

    showFeedback(
      "success",
      `Cadastro recebido, ${firstName}! Entraremos em contato em breve. ` +
        `(${total} cadastro${total > 1 ? "s" : ""} salvo${total > 1 ? "s" : ""} neste navegador.)`,
    );
  });

  form.addEventListener("reset", () => {
    // O reset devolve os valores só depois do evento, então o contador espera.
    setTimeout(() => {
      updateCounter();
      cpfInput.setCustomValidity("");
    }, 0);
    Array.prototype.forEach.call(form.elements, (field) =>
      field.removeAttribute?.("aria-invalid"),
    );
    clearFeedback();
    clearDraft();
  });
}
