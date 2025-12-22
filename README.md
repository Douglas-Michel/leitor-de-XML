# Fiscal Flow

**Aplicação web para extrair, visualizar e exportar dados de notas fiscais eletrônicas (NF-e) e conhecimentos de transporte (CT-e) a partir de arquivos XML.**

---

## ✨ Recursos

- Leitura e parse de arquivos `.xml` (NF-e e CT-e)
- Extração de informações fiscais (valores, alíquotas, ICMS, PIS, COFINS, IPI, DIFAL, chave de acesso, etc.)
- Visualização em tabela com busca e filtros
- Resumo com cards de valores agregados
- Exportação para Excel (.xlsx) com planilha de dados e planilha de resumo
- Upload por arrastar/soltar ou seleção de arquivos

---

## 🚀 Começando

### Pré-requisitos

- Node.js (recomendo v18+)
- Gerenciador de pacotes: npm / pnpm / yarn / bun

### Instalação

```bash
# com npm
npm install

# com pnpm
pnpm install

# com bun
bun install
```

### Executando em desenvolvimento

```bash
# iniciar dev server
npm run dev
# ou
pnpm dev
# ou
bun run dev
```

Acesse http://localhost:5173 (ou a porta mostrada no terminal).

### Build e preview

```bash
# build de produção
npm run build

# preview do build
npm run preview
```

### Lint

```bash
npm run lint
```

---

## 📂 Estrutura principal

- `src/pages/Index.tsx` – página principal com upload, lista e exportação
- `src/components/FileUploadZone.tsx` – zona de drag & drop e processamento de arquivos
- `src/components/DataTable.tsx` – exibição de dados extraídos
- `src/lib/xmlParser.ts` – lógica de parsing e normalização dos dados fiscais
- `src/lib/excelExport.ts` – exportação para Excel (xlsx)

---

## 🧩 Como usar

1. Abra a aplicação no navegador.
2. Arraste e solte arquivos `.xml` (ou clique para selecionar).
3. Aguarde o processamento — arquivos inválidos/maus formatados serão ignorados.
4. Use a busca para filtrar por número, fornecedor, tipo ou data.
5. Clique em **Exportar** para gerar um arquivo `.xlsx` com os dados e um resumo.
6. Use **Limpar** para remover resultados carregados.

> Observação: o parser tenta extrair campos padrões de NF-e e CT-e. Se um XML estiver em esquema não esperado, os dados podem não ser extraídos corretamente.

---

## 🛠️ Contribuindo

1. Abra uma issue descrevendo o que deseja melhorar ou corrigir.
2. Faça um fork, crie uma branch com sua feature/bugfix e abra um PR.
3. Siga as regras de lint (`npm run lint`) e mantenha o código em TypeScript.

---

## 📝 Licença

Nenhuma licença está definida no repositório. Se quiser permitir uso aberto, adicione um arquivo `LICENSE` (por exemplo, MIT).

---

## Contato

Se precisar de ajuda, abra uma issue no repositório.

---

Feito com ❤️ — se quiser, posso ajustar o README (adicionar badges, exemplos de screenshots ou instruções de deploy).