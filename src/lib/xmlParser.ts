export interface NotaFiscal {
  id: string;
  tipo: 'NF-e' | 'CT-e';
  tipoOperacao: 'Entrada' | 'Saída';
  numero: string;
  numeroCTe: string;
  serie: string;
  dataEmissao: string;
  fornecedorCliente: string;
  cnpjCpf: string;
  valorTotal: number;
  baseCalculoICMS: number;
  // PIS
  aliquotaPIS: number;
  valorPIS: number;
  // COFINS
  aliquotaCOFINS: number;
  valorCOFINS: number;
  // IPI
  aliquotaIPI: number;
  valorIPI: number;
  // ICMS
  aliquotaICMS: number;
  valorICMS: number;
  // DIFAL
  aliquotaDIFAL: number;
  valorDIFAL: number;
  // Extras
  ano: string;
  reducaoICMS: number;
  chaveAcesso: string;
}

function getTextContent(element: Element | null, tagName: string): string {
  if (!element) return '';
  const node = element.getElementsByTagName(tagName)[0];
  return node?.textContent?.trim() || '';
}

function getNumericContent(element: Element | null, tagName: string): number {
  const text = getTextContent(element, tagName);
  return parseFloat(text) || 0;
}

export function parseNFeXML(xmlContent: string, fileName: string): NotaFiscal | null {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
    
    const parserError = xmlDoc.getElementsByTagName('parsererror')[0];
    if (parserError) {
      console.error('XML parsing error:', parserError.textContent);
      return null;
    }

    const nfe = xmlDoc.getElementsByTagName('NFe')[0] || xmlDoc.getElementsByTagName('nfeProc')[0];
    const cte = xmlDoc.getElementsByTagName('CTe')[0] || xmlDoc.getElementsByTagName('cteProc')[0];

    if (nfe) {
      return parseNFe(nfe, fileName);
    } else if (cte) {
      return parseCTe(cte, fileName);
    }

    return null;
  } catch (error) {
    console.error('Error parsing XML:', error);
    return null;
  }
}

function parseNFe(doc: Element, fileName: string): NotaFiscal {
  const infNFe = doc.getElementsByTagName('infNFe')[0];
  const ide = doc.getElementsByTagName('ide')[0];
  const emit = doc.getElementsByTagName('emit')[0];
  const dest = doc.getElementsByTagName('dest')[0];
  const total = doc.getElementsByTagName('total')[0];
  const icmsTot = total?.getElementsByTagName('ICMSTot')[0];
  
  const tpNF = getTextContent(ide, 'tpNF');
  const tipoOperacao = tpNF === '0' ? 'Entrada' : 'Saída';
  
  const chaveAcesso = infNFe?.getAttribute('Id')?.replace('NFe', '') || '';
  
  const parceiro = tipoOperacao === 'Saída' ? dest : emit;
  const nome = getTextContent(parceiro, 'xNome');
  const cnpj = getTextContent(parceiro, 'CNPJ') || getTextContent(parceiro, 'CPF');

  const baseICMS = getNumericContent(icmsTot, 'vBC');
  const valorICMS = getNumericContent(icmsTot, 'vICMS');
  const aliquotaICMS = baseICMS > 0 ? (valorICMS / baseICMS) * 100 : 0;

  const valorTotal = getNumericContent(icmsTot, 'vProd');
  const valorPIS = getNumericContent(icmsTot, 'vPIS');
  const valorCOFINS = getNumericContent(icmsTot, 'vCOFINS');
  const valorIPI = getNumericContent(icmsTot, 'vIPI');
  const valorDIFAL = getNumericContent(icmsTot, 'vICMSUFDest') || 0;

  // Calculate rates based on total value
  const aliquotaPIS = valorTotal > 0 ? (valorPIS / valorTotal) * 100 : 0;
  const aliquotaCOFINS = valorTotal > 0 ? (valorCOFINS / valorTotal) * 100 : 0;
  const aliquotaIPI = valorTotal > 0 ? (valorIPI / valorTotal) * 100 : 0;
  const aliquotaDIFAL = baseICMS > 0 ? (valorDIFAL / baseICMS) * 100 : 0;

  // Redução ICMS (pRedBC)
  const dets = doc.getElementsByTagName('det');
  let reducaoICMS = 0;
  if (dets.length > 0) {
    const icmsElement = dets[0]?.getElementsByTagName('ICMS')[0];
    if (icmsElement) {
      const icmsChild = icmsElement.children[0];
      reducaoICMS = getNumericContent(icmsChild, 'pRedBC');
    }
  }

  const dataStr = getTextContent(ide, 'dhEmi') || getTextContent(ide, 'dEmi');
  const ano = dataStr ? dataStr.substring(0, 4) : '';

  return {
    id: crypto.randomUUID(),
    tipo: 'NF-e',
    tipoOperacao,
    numero: getTextContent(ide, 'nNF'),
    numeroCTe: '',
    serie: getTextContent(ide, 'serie'),
    dataEmissao: formatDate(dataStr),
    fornecedorCliente: nome,
    cnpjCpf: formatCnpjCpf(cnpj),
    valorTotal,
    baseCalculoICMS: baseICMS,
    aliquotaPIS: Math.round(aliquotaPIS * 100) / 100,
    valorPIS,
    aliquotaCOFINS: Math.round(aliquotaCOFINS * 100) / 100,
    valorCOFINS,
    aliquotaIPI: Math.round(aliquotaIPI * 100) / 100,
    valorIPI,
    aliquotaICMS: Math.round(aliquotaICMS * 100) / 100,
    valorICMS,
    aliquotaDIFAL: Math.round(aliquotaDIFAL * 100) / 100,
    valorDIFAL,
    ano,
    reducaoICMS,
    chaveAcesso,
  };
}

function parseCTe(doc: Element, fileName: string): NotaFiscal {
  const infCte = doc.getElementsByTagName('infCte')[0];
  const ide = doc.getElementsByTagName('ide')[0];
  const emit = doc.getElementsByTagName('emit')[0];
  const rem = doc.getElementsByTagName('rem')[0];
  const vPrest = doc.getElementsByTagName('vPrest')[0];
  const imp = doc.getElementsByTagName('imp')[0];
  const icms = imp?.getElementsByTagName('ICMS')[0];
  
  const tpCTe = getTextContent(ide, 'tpCTe');
  const tipoOperacao = tpCTe === '1' ? 'Entrada' : 'Saída';
  
  const chaveAcesso = infCte?.getAttribute('Id')?.replace('CTe', '') || '';
  
  const parceiro = rem || emit;
  const nome = getTextContent(parceiro, 'xNome');
  const cnpj = getTextContent(parceiro, 'CNPJ') || getTextContent(parceiro, 'CPF');

  const icmsChild = icms?.children[0];
  const baseICMS = getNumericContent(icmsChild, 'vBC');
  const valorICMS = getNumericContent(icmsChild, 'vICMS');
  const aliquotaICMS = getNumericContent(icmsChild, 'pICMS');
  const reducaoICMS = getNumericContent(icmsChild, 'pRedBC');

  const valorTotal = getNumericContent(vPrest, 'vTPrest') || getNumericContent(vPrest, 'vRec');
  const valorPIS = getNumericContent(imp, 'vPIS') || 0;
  const valorCOFINS = getNumericContent(imp, 'vCOFINS') || 0;
  const valorDIFAL = getNumericContent(icmsChild, 'vICMSUFDest') || 0;

  const aliquotaPIS = valorTotal > 0 ? (valorPIS / valorTotal) * 100 : 0;
  const aliquotaCOFINS = valorTotal > 0 ? (valorCOFINS / valorTotal) * 100 : 0;
  const aliquotaDIFAL = baseICMS > 0 ? (valorDIFAL / baseICMS) * 100 : 0;

  const dataStr = getTextContent(ide, 'dhEmi') || getTextContent(ide, 'dEmi');
  const ano = dataStr ? dataStr.substring(0, 4) : '';

  return {
    id: crypto.randomUUID(),
    tipo: 'CT-e',
    tipoOperacao,
    numero: getTextContent(ide, 'nCT'),
    numeroCTe: getTextContent(ide, 'nCT'),
    serie: getTextContent(ide, 'serie'),
    dataEmissao: formatDate(dataStr),
    fornecedorCliente: nome,
    cnpjCpf: formatCnpjCpf(cnpj),
    valorTotal,
    baseCalculoICMS: baseICMS,
    aliquotaPIS: Math.round(aliquotaPIS * 100) / 100,
    valorPIS,
    aliquotaCOFINS: Math.round(aliquotaCOFINS * 100) / 100,
    valorCOFINS,
    aliquotaIPI: 0,
    valorIPI: 0,
    aliquotaICMS,
    valorICMS,
    aliquotaDIFAL: Math.round(aliquotaDIFAL * 100) / 100,
    valorDIFAL,
    ano,
    reducaoICMS,
    chaveAcesso,
  };
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr.split('T')[0]);
    return date.toLocaleDateString('pt-BR');
  } catch {
    return dateStr;
  }
}

function formatCnpjCpf(value: string): string {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (digits.length === 14) {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return value;
}

export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) value = 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatPercent(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '0.00%';
  return `${value.toFixed(2)}%`;
}
