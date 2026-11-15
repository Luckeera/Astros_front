import React, { useState, useRef } from 'react';
import { 
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, 
  Link as LinkIcon, Quote, Code, List, ListOrdered, Minus, 
  Eye, Pencil, Save, X, Sparkles
} from 'lucide-react';

const DocumentationEditor = ({ 
  initialValue = '', 
  onSave, 
  onCancel, 
  isSaving = false 
}) => {
  const [content, setContent] = useState(initialValue);
  const textareaRef = useRef(null);

  // Aplica formatação ao texto selecionado (ou insere no cursor)
  const applyFormat = (prefix, suffix = '', defaultText = 'texto') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || defaultText;

    const before = content.substring(0, start);
    const after = content.substring(end);

    const newContent = `${before}${prefix}${selectedText}${suffix}${after}`;
    setContent(newContent);

    // Reposiciona o cursor após a inserção
    setTimeout(() => {
      textarea.focus();
      const newCursorStart = start + prefix.length;
      const newCursorEnd = newCursorStart + selectedText.length;
      textarea.setSelectionRange(newCursorStart, newCursorEnd);
    }, 0);
  };

  // Aplica prefixo no início da linha atual (para cabeçalhos, citações, listas)
  const applyLinePrefix = (prefix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const before = content.substring(0, start);
    const lastNewline = before.lastIndexOf('\n');
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

    const beforeLine = content.substring(0, lineStart);
    const afterLineStart = content.substring(lineStart);

    const newContent = `${beforeLine}${prefix} ${afterLineStart}`;
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(lineStart + prefix.length + 1, lineStart + prefix.length + 1);
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        applyFormat('**', '**', 'negrito');
      } else if (e.key.toLowerCase() === 'i') {
        e.preventDefault();
        applyFormat('*', '*', 'itálico');
      }
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-2xl overflow-hidden flex flex-col transition-all">
      {/* Top Header do Editor (Estilo Obsidian: Direto e Focado) */}
      <div className="p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFA900] text-black font-black text-[10px] uppercase tracking-wider">
              Modo Edição
            </span>
            <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <Pencil className="h-5 w-5 text-[#FFA900]" /> Editando Documentação
            </h2>
          </div>
          <p className="text-xs text-gray-300 mt-1 font-medium">
            Digite em Markdown diretamente ou utilize a barra de ferramentas abaixo.
          </p>
        </div>

        {/* Ações Rápidas de Topo */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-700 transition-all"
            title="Voltar ao Modo Leitura sem Salvar"
          >
            <Eye className="h-3.5 w-3.5" /> Modo Leitura
          </button>
          
          <button
            type="button"
            onClick={() => onSave(content)}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-[#FFA900] text-gray-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-white transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Salvar
          </button>
        </div>
      </div>

      {/* Toolbar Visual Obsidian-style */}
      <div className="bg-gray-50 border-b border-gray-200/80 px-4 py-2.5 flex flex-wrap items-center gap-1">
        {/* Formatação básica */}
        <button
          type="button"
          onClick={() => applyFormat('**', '**', 'negrito')}
          className="p-2 text-gray-700 hover:text-black hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200"
          title="Negrito (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('*', '*', 'itálico')}
          className="p-2 text-gray-700 hover:text-black hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200"
          title="Itálico (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('~~', '~~', 'tachado')}
          className="p-2 text-gray-700 hover:text-black hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200"
          title="Tachado"
        >
          <Strikethrough className="h-4 w-4" />
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        {/* Cabeçalhos */}
        <button
          type="button"
          onClick={() => applyLinePrefix('#')}
          className="px-2.5 py-1.5 text-xs font-black text-gray-700 hover:text-black hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200"
          title="Título Principal (H1)"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => applyLinePrefix('##')}
          className="px-2.5 py-1.5 text-xs font-black text-gray-700 hover:text-black hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200"
          title="Subtítulo (H2)"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => applyLinePrefix('###')}
          className="px-2.5 py-1.5 text-xs font-black text-gray-700 hover:text-black hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200"
          title="Seção (H3)"
        >
          H3
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        {/* Elementos ricos */}
        <button
          type="button"
          onClick={() => applyFormat('[', '](https://exemplo.com)', 'Link de Exemplo')}
          className="p-2 text-gray-700 hover:text-black hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200"
          title="Inserir Link"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => applyLinePrefix('>')}
          className="p-2 text-gray-700 hover:text-black hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200"
          title="Bloco de Citação"
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('`', '`', 'código_inline')}
          className="p-2 text-gray-700 hover:text-black hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200"
          title="Código Inline"
        >
          <Code className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('```\n', '\n```', '// Bloco de código')}
          className="px-2.5 py-1.5 text-[11px] font-mono font-bold text-gray-700 hover:text-black hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200"
          title="Bloco de Código"
        >
          {'```'}
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        {/* Listas & Divisor */}
        <button
          type="button"
          onClick={() => applyLinePrefix('-')}
          className="p-2 text-gray-700 hover:text-black hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200"
          title="Lista com Marcadores"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => applyLinePrefix('1.')}
          className="p-2 text-gray-700 hover:text-black hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200"
          title="Lista Numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('\n---\n', '', '')}
          className="p-2 text-gray-700 hover:text-black hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200"
          title="Linha Divisória"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>

      {/* Área Central: Edição em Largura Total (Sem telas divididas) */}
      <div className="p-6 md:p-8 bg-white flex flex-col min-h-[420px]">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escreva a documentação oficial do projeto (propósito, arquitetura, tecnologias, regras, links)..."
          className="w-full min-h-[380px] p-6 bg-gray-50/70 border border-gray-200 rounded-2xl text-gray-900 font-mono text-sm md:text-base leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-[#FFA900] focus:border-transparent transition-all"
        />
        <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-gray-400 font-medium gap-2">
          <span>{content.length} caracteres • {content.trim().split(/\s+/).filter(Boolean).length} palavras</span>
          <span className="flex items-center gap-1 text-gray-500">
            <Sparkles className="h-3.5 w-3.5 text-[#FFA900]" /> Sintaxe Markdown padrão ativa
          </span>
        </div>
      </div>

      {/* Footer com Ações */}
      <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="px-6 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-100 transition-all flex items-center gap-2"
        >
          <X className="h-4 w-4" /> Cancelar
        </button>

        <button
          type="button"
          onClick={() => onSave(content)}
          disabled={isSaving}
          className="px-8 py-3 rounded-2xl bg-[#FFA900] text-gray-950 font-black text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-all shadow-lg shadow-[#FFA900]/20 flex items-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-50 border-2 border-gray-900"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Salvar Documentação
        </button>
      </div>
    </div>
  );
};

export default DocumentationEditor;
