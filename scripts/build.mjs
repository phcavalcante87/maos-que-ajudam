// Build de produção: minifica CSS/JS/HTML e recomprime imagens para dist/.
// dist/ espelha a mesma estrutura de pastas do projeto (html/css/js/img),
// então os caminhos relativos dos arquivos-fonte (ex.: "../css/style.css")
// continuam válidos sem nenhuma reescrita.
import { readFile, writeFile, mkdir, rm, readdir, stat, copyFile } from "node:fs/promises";
import { join, dirname, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { minify as minifyJs } from "terser";
import CleanCSS from "clean-css";
import { minify as minifyHtml } from "html-minifier-terser";
import sharp from "sharp";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(root, "dist");

const totals = { before: 0, after: 0 };

function track(before, after) {
  totals.before += before;
  totals.after += after;
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

async function buildJs() {
  const srcDir = join(root, "js");
  const files = (await walk(srcDir)).filter((f) => f.endsWith(".js"));
  for (const file of files) {
    const code = await readFile(file, "utf8");
    const result = await minifyJs(code, {
      module: true,
      compress: true,
      mangle: true,
    });
    const outPath = join(distDir, "js", relative(srcDir, file));
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, result.code, "utf8");
    track(Buffer.byteLength(code), Buffer.byteLength(result.code));
  }
}

async function buildCss() {
  const file = join(root, "css", "style.css");
  const code = await readFile(file, "utf8");
  const result = new CleanCSS({ level: 2 }).minify(code);
  const outPath = join(distDir, "css", "style.css");
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, result.styles, "utf8");
  track(Buffer.byteLength(code), Buffer.byteLength(result.styles));
}

async function buildHtml() {
  const srcDir = join(root, "html");
  const files = (await readdir(srcDir)).filter((f) => f.endsWith(".html"));
  for (const name of files) {
    const file = join(srcDir, name);
    const code = await readFile(file, "utf8");
    const minified = await minifyHtml(code, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
    });
    const outPath = join(distDir, "html", name);
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, minified, "utf8");
    track(Buffer.byteLength(code), Buffer.byteLength(minified));
  }
}

async function buildImg() {
  const srcDir = join(root, "img");
  const files = await readdir(srcDir);
  for (const name of files) {
    const file = join(srcDir, name);
    const outPath = join(distDir, "img", name);
    await mkdir(dirname(outPath), { recursive: true });
    const before = (await stat(file)).size;
    if (extname(name).toLowerCase() === ".webp") {
      // Recodifica no mesmo formato com qualidade 78 (equilíbrio entre
      // tamanho de arquivo e fidelidade visual) em vez de copiar como está.
      await sharp(file).webp({ quality: 78 }).toFile(outPath);
    } else {
      await copyFile(file, outPath);
    }
    const after = (await stat(outPath)).size;
    track(before, after);
  }
}

// O GitHub Pages serve a raiz do site (`/`) a partir de dist/index.html,
// mas a página inicial de verdade vive em html/index.html (para manter a
// separação de pastas por tipo de arquivo no código-fonte). Este arquivo só
// existe no build de produção — não faz parte da árvore versionada.
async function buildRootRedirect() {
  const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Mãos que Ajudam</title>
    <meta http-equiv="refresh" content="0; url=html/index.html" />
    <script>location.replace("html/index.html");</script>
  </head>
  <body>
    <p>Redirecionando... <a href="html/index.html">clique aqui</a> se nada acontecer.</p>
  </body>
</html>
`;
  await writeFile(join(distDir, "index.html"), html, "utf8");
}

async function main() {
  await rm(distDir, { recursive: true, force: true });
  await buildCss();
  await buildJs();
  await buildHtml();
  await buildImg();
  await buildRootRedirect();

  const pct = (100 * (1 - totals.after / totals.before)).toFixed(1);
  console.log(
    `Build concluído: ${totals.before} B -> ${totals.after} B (-${pct}%) em ${relative(root, distDir)}/`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
