import React from 'react';

/**
 * Componente leve para renderizar Markdown com o design system do Astros
 * Suporta Títulos (H1, H2, H3), Negrito, Itálico, Tachado, Links, Citações,
 * Listas ordenadas e não ordenadas, Blocos de código, Código inline e Divisores.
 */
export const renderInlineMarkdown = (text) => {
  if (!text) return '';

  // Processa tokens inline: links, negrito, itálico, tachado, inline code
  const tokens = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Links: [texto](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      tokens.push(
        <a
          key={`link-${key++}`}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FFA900] hover:text-amber-600 font-bold underline underline-offset-4 transition-colors inline-flex items-center gap-1"
        >
          {linkMatch[1]}
        </a>
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Código inline: `código`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      tokens.push(
        <code
          key={`code-${key++}`}
          className="px-2 py-0.5 mx-0.5 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-md font-mono text-xs font-semibold"
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Negrito: **texto** ou __texto__
    const boldMatch = remaining.match(/^(\*\*|__)(.*?)\1/);
    if (boldMatch) {
      tokens.push(
        <strong key={`bold-${key++}`} className="font-black text-gray-900">
          {boldMatch[2]}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Tachado: ~~texto~~
    const strikeMatch = remaining.match(/^~~(.*?)~~/);
    if (strikeMatch) {
      tokens.push(
        <del key={`del-${key++}`} className="line-through text-gray-400">
          {strikeMatch[1]}
        </del>
      );
      remaining = remaining.slice(strikeMatch[0].length);
      continue;
    }

    // Itálico: *texto* ou _texto_
    const italicMatch = remaining.match(/^(\*|_)(.*?)\1/);
    if (italicMatch) {
      tokens.push(
        <em key={`italic-${key++}`} className="italic text-gray-800">
          {italicMatch[2]}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Texto normal até o próximo caractere especial
    const nextSpecial = remaining.search(/(\[|`|\*\*|__|~~|\*|_)/);
    if (nextSpecial === -1) {
      tokens.push(remaining);
      break;
    } else if (nextSpecial === 0) {
      tokens.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      tokens.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return tokens;
};

const MarkdownViewer = ({ content, className = '', emptyMessage = 'Nenhuma documentação detalhada adicionada ainda.' }) => {
  if (!content) {
    return (
      <div className="py-12 text-center text-gray-400 italic font-medium">
        {emptyMessage}
      </div>
    );
  }

  const lines = content.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let currentList = null; // { type: 'ul' | 'ol', items: [] }

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`ul-${elements.length}`} className="my-3 space-y-2 pl-4 list-disc marker:text-[#FFA900]">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="text-gray-700 leading-relaxed font-medium">
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol-${elements.length}`} className="my-3 space-y-2 pl-4 list-decimal marker:font-black marker:text-[#FFA900]">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="text-gray-700 leading-relaxed font-medium">
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Bloco de código: ```
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <div key={`code-block-${elements.length}`} className="my-4 rounded-2xl bg-gray-950 p-5 shadow-inner border border-gray-800 overflow-x-auto">
            <pre className="text-amber-300 font-mono text-xs md:text-sm leading-relaxed">
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Linha vazia
    if (!line.trim()) {
      flushList();
      continue;
    }

    // Linha divisória: --- ou ***
    if (line.trim() === '---' || line.trim() === '***') {
      flushList();
      elements.push(<hr key={`hr-${elements.length}`} className="my-6 border-t-2 border-gray-100" />);
      continue;
    }

    // Cabeçalho H1: # Título
    if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={`h1-${elements.length}`} className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mt-8 mb-4 border-b border-gray-100 pb-3 flex items-center gap-3">
          <span className="w-2.5 h-6 bg-[#FFA900] rounded-full inline-block" />
          {renderInlineMarkdown(line.slice(2).trim())}
        </h1>
      );
      continue;
    }

    // Cabeçalho H2: ## Subtítulo
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${elements.length}`} className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mt-6 mb-3">
          {renderInlineMarkdown(line.slice(3).trim())}
        </h2>
      );
      continue;
    }

    // Cabeçalho H3: ### Tópico
    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${elements.length}`} className="text-lg md:text-xl font-black text-gray-800 tracking-tight mt-5 mb-2">
          {renderInlineMarkdown(line.slice(4).trim())}
        </h3>
      );
      continue;
    }

    // Citação: > texto
    if (line.startsWith('>')) {
      flushList();
      elements.push(
        <blockquote key={`quote-${elements.length}`} className="my-4 border-l-4 border-[#FFA900] bg-amber-500/5 px-5 py-4 rounded-r-2xl italic text-gray-700 font-medium leading-relaxed shadow-sm">
          {renderInlineMarkdown(line.replace(/^>\s*/, ''))}
        </blockquote>
      );
      continue;
    }

    // Lista não ordenada: - item ou * item
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const itemText = line.trim().replace(/^[-*]\s+/, '');
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      continue;
    }

    // Lista ordenada: 1. item
    const orderedMatch = line.trim().match(/^\d+\.\s+(.*)/);
    if (orderedMatch) {
      const itemText = orderedMatch[1];
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      continue;
    }

    // Parágrafo regular
    flushList();
    elements.push(
      <p key={`p-${elements.length}`} className="my-3 text-gray-700 font-medium leading-relaxed text-base">
        {renderInlineMarkdown(line)}
      </p>
    );
  }

  flushList();

  return <div className={`space-y-1 prose prose-amber max-w-none ${className}`}>{elements}</div>;
};

export default MarkdownViewer;
