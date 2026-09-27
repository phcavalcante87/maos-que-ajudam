# Mãos que Ajudam

Site institucional de uma ONG fictícia, implementado como **Single Page Application (SPA)** em JavaScript puro (sem frameworks), com foco em estrutura semântica, acessibilidade (WCAG 2.1) e boas práticas de organização de código front-end.

Projeto acadêmico do curso de Análise e Desenvolvimento de Sistemas.

## Funcionalidades

- Navegação fluida entre três páginas (Início, Projetos, Cadastro de Voluntário) sem recarregar o documento, via roteamento por hash (`#/`, `#/projetos`, `#/cadastro`).
- Submenu de categorias de projetos com rolagem e destaque automático até o card correspondente.
- Menu responsivo com botão hambúrguer em telas estreitas.
- Alternância entre tema claro e escuro, persistida no navegador.
- Formulário de cadastro de voluntário com máscaras de campo (CPF, telefone, CEP), validação de dígito verificador do CPF, feedback visual de sucesso/erro e rascunho salvo automaticamente enquanto o usuário digita.
- Histórico de cadastros enviados guardado localmente no navegador.

## Tecnologias

- HTML5 semântico
- CSS3 (variáveis nativas, Grid de 12 colunas, Flexbox, media queries)
- JavaScript (ES Modules, sem build step, sem dependências externas)
- Web Storage API (`localStorage`)

Nenhum framework, biblioteca ou pacote NPM foi utilizado na lógica da aplicação. A única integração externa é a fonte Poppins, carregada via Google Fonts.

## Estrutura de pastas

```
├── html/                  Páginas HTML
│   ├── index.html         Shell da SPA (cabeçalho, rodapé e <main> onde as views são renderizadas)
│   ├── projetos.html      Redirecionamento para index.html#/projetos (compatibilidade com links antigos)
│   └── cadastro.html      Redirecionamento para index.html#/cadastro
├── css/
│   └── style.css          Folha de estilos única: design system, grid, componentes e breakpoints
├── img/
│   └── equipe-voluntarios.webp
└── js/
    ├── main.js            Ponto de entrada: inicializa menu e roteador
    ├── router.js          Roteamento por hash e renderização das views
    ├── nav.js             Menu hambúrguer, submenu e link ativo
    ├── validation.js      Máscaras, validação e feedback do formulário
    ├── storage.js         Leitura/gravação no localStorage
    ├── theme.js           Alternância de tema claro/escuro
    ├── templates/         Uma função de template por página (retornam HTML a partir de dados)
    └── data/              Dados das páginas (ex.: lista de projetos)
```

## Como executar localmente

O projeto usa módulos ES (`<script type="module">`), que exigem que os arquivos sejam servidos por HTTP — abrir `html/index.html` diretamente com duplo clique (`file://`) não funciona, pois os navegadores bloqueiam a importação de módulos nesse esquema.

Com Python instalado, a partir da raiz do projeto:

```bash
python -m http.server 8080
```

Depois acesse `http://localhost:8080/html/index.html`.

Qualquer outro servidor estático (Live Server do VS Code, `npx serve`, etc.) também funciona.

## Arquitetura da SPA

- **Roteamento**: `router.js` escuta o evento `hashchange`, identifica a rota atual e substitui o conteúdo de `<main id="app-view">` pelo HTML da view correspondente.
- **Templates**: cada view (`js/templates/*.js`) é uma função que recebe dados e devolve uma string HTML, usando um pequeno motor de template literals (`js/templates/engine.js`).
- **Dados**: conteúdo dinâmico (como a lista de projetos) fica separado em `js/data/`, independente da camada visual.
- **Validação**: `validation.js` liga máscaras, validações e autosave de rascunho ao formulário sempre que a view de cadastro é montada.
- **Persistência**: toda leitura/gravação em `localStorage` passa por `storage.js`, o único módulo que conhece esse detalhe de implementação.

## Acessibilidade

O projeto busca conformidade com a **WCAG 2.1 (Nível AA)**. Práticas adotadas:

- **Estrutura semântica**: `header`/`nav`/`main`/`footer` como landmarks, hierarquia de títulos sem saltos, `aria-labelledby` associando cada seção ao seu título.
- **Navegação por teclado**: skip link ("Pular para o conteúdo principal") antes do cabeçalho; submenu de projetos acessível via `:focus-within` (não depende de mouse); indicador de foco visível (`:focus-visible`) só para navegação por teclado.
- **Leitores de tela**: `aria-expanded`/`aria-controls` no menu hambúrguer; `aria-label` dinâmico no botão de tema; `aria-invalid` sincronizado em cada campo do formulário (não só a cor da borda indica erro); `role="alert"` no feedback do formulário; foco movido para o conteúdo a cada troca de rota, já que a SPA não recarrega a página.
- **Contraste de cor**: todas as combinações de texto/fundo dos dois temas foram verificadas com a fórmula de luminância relativa do WCAG 2.1 (mesmo cálculo do WebAIM Contrast Checker). Duas falhas encontradas (botões com texto branco e a mensagem de erro no tema escuro) foram corrigidas; todos os pares atualmente atingem no mínimo 4.5:1 (texto) ou 3:1 (indicador de foco).
- **Movimento**: toda animação e transição é desativada quando o usuário tem `prefers-reduced-motion: reduce` ativado no sistema.

Este é um processo contínuo, não uma certificação formal — outros critérios (como reflow em zoom de 400% ou testes com leitores de tela reais) ainda não foram verificados.

## Versionamento

O projeto segue o modelo **GitFlow**:

- `main` recebe apenas merges de release, sempre marcados com uma tag (`v1.0.0`).
- `develop` é a branch de integração de todo o trabalho em andamento.
- `feature/*` isola cada funcionalidade, nasce a partir de `develop` e é descartada após o merge.

Cada funcionalidade tem uma **Issue** de acompanhamento, é desenvolvida em sua branch e integrada via **Pull Request** para `develop` (corpo do PR com `Closes #N`), fechando a issue automaticamente quando o release chega em `main`. O trabalho é organizado por **Milestones**, um por etapa do projeto.

Commits seguem o padrão [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `style:`, `chore:`, `docs:`), descrevendo o que mudou e por quê.

## Licença

Projeto acadêmico, sem licença de uso definida.
