// Garante que o Node em uso é o do .nvmrc. O better-sqlite3 é um módulo nativo
// compilado para uma versão específica do Node; com outra versão a API cai no boot
// e o Vite responde 502 em /api.
import { readFileSync } from 'node:fs';

const expected = readFileSync(new URL('../.nvmrc', import.meta.url), 'utf8').trim();
const current = process.versions.node.split('.')[0];

if (current !== expected) {
  console.error(
    `\n✖ Node ${process.versions.node} em uso, mas o projeto requer Node ${expected} (.nvmrc).\n` +
      `  Rode:  nvm use        (ou: nvm alias default ${expected}, para fixar)\n` +
      `  Se trocou de versão depois do npm install, rode também:  npm rebuild better-sqlite3\n`,
  );
  process.exit(1);
}
