# Changelog

Todas as mudanças relevantes do projeto, por versão.

## [v1.2.0] - Etapa 4: Otimização e deploy para produção

- Script de build (`scripts/build.mjs`) que minifica CSS (`clean-css`), JavaScript (`terser`) e HTML (`html-minifier-terser`), e recomprime a imagem institucional para WebP qualidade 78 (`sharp`).
- Redução de ~60% no tamanho total dos arquivos (imagem: ~249 KB → ~80 KB).
- Pipeline de CI/CD (`.github/workflows/deploy.yml`): build e publicação automática no GitHub Pages a cada push em `main`.
- Documentação do processo de build e deploy no README.

## [v1.1.0] - Etapa 3: Implementação de acessibilidade

- Auditoria de contraste de cor (fórmula de luminância relativa do WCAG 2.1) em todos os pares texto/fundo dos dois temas; 2 falhas corrigidas (botões com texto branco, mensagem de erro no tema escuro).
- Skip link ("Pular para o conteúdo principal") para navegação por teclado.
- `aria-invalid` sincronizado nos campos do formulário para leitores de tela.
- Remoção de uma contradição ARIA (`role="alert"` + `aria-live="polite"`) no feedback do formulário.
- Seção de Acessibilidade documentada no README.

## [v1.0.0] - Etapa 2: Controlo de versões e documentação

- Estrutura HTML semântica das três páginas, com formulário de cadastro acessível.
- Design system em CSS (variáveis de cor, tipografia e espaçamento), grid de 12 colunas e componentes visuais.
- Imagem institucional com atributo `alt` descritivo.
- Conversão do site estático em Single Page Application: roteamento por hash, motor de templates, validação de formulário com autosave e persistência em `localStorage`, tudo em módulos JS organizados por responsabilidade.
- Reorganização do projeto em pastas por tipo de arquivo (`html/`, `css/`, `js/`, `img/`).
- Repositório estruturado em GitFlow (`main`/`develop`/`feature/*`), com Issues, Pull Requests e Milestones documentando cada entrega.
