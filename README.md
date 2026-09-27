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

## Licença

Projeto acadêmico, sem licença de uso definida.
