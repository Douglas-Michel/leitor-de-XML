# Conversor XML ✅

**Projeto**: Aplicação React + Vite para fazer upload de arquivos XML, parsear os dados e exportar para Excel (.xlsx).

## 🔧 Principais funcionalidades

- Upload de arquivos XML via `FileUploadZone` 📁
- Parse e extração de dados usando `src/lib/xmlParser.ts` 🔍
- Visualização em tabela com `DataTable.tsx` 📊
- Exportação para Excel via `src/lib/excelExport.ts` (usa `xlsx`) 📤
- Resumo e estatísticas com `SummaryCards.tsx` 🧾

## 🧩 Stack e dependências

- React + Vite + TypeScript
- Tailwind CSS
- xlsx (para geração de Excel)
- Diversos componentes do Radix UI e bibliotecas utilitárias

## 🚀 Instalação & execução

1. Instalar dependências:

```bash
npm install

```

2. Executar em modo de desenvolvimento:

```bash
npm run dev
```

3. Build para produção:

```bash
npm run build
```

4. Visualizar build (preview):

```bash
npm run preview
```

5. Lint:

```bash
npm run lint
```

> Observação: os scripts acima estão definidos em `package.json` (`dev`, `build`, `build:dev`, `preview`, `lint`).

## 🗂 Estrutura relevante do projeto

- `src/`
  - `components/`
    - `FileUploadZone.tsx` — área de upload do XML
    - `DataTable.tsx` — exibição tabular dos dados
    - `ExportButton.tsx` — botão para exportar XLSX
    - `SummaryCards.tsx` — cards de resumo
  - `lib/`
    - `xmlParser.ts` — funções para parsear XML
    - `excelExport.ts` — funções para gerar planilhas
  - `pages/` — rotas / páginas

## 📝 Como usar

1. Abra a aplicação em `localhost` com `npm run dev`.
2. Arraste ou selecione o arquivo XML no componente de upload.
3. Aguarde o parsing — os dados aparecerão na tabela e nos cards.
4. Clique em **Exportar** para baixar um arquivo `.xlsx` com os dados.

## 🤝 Contribuição

Issues e PRs são bem-vindos. Para mudanças grandes, abra uma issue antes para discutir a implementação.

## ⚖️ Licença

Nenhuma licença especificada no repositório. Adicione um `LICENSE` se quiser tornar o projeto reutilizável por terceiros.

## 💬 Contato

Abra uma issue para reportar bugs, solicitar recursos ou tirar dúvidas.

---

*README gerado automaticamente — revise e personalize conforme necessário.*
