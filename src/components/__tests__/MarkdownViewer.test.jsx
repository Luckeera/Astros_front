import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MarkdownViewer from '../MarkdownViewer';

describe('MarkdownViewer Component', () => {
  it('deve renderizar mensagem amigável quando o conteúdo estiver vazio', () => {
    render(<MarkdownViewer content="" emptyMessage="Nenhum conteúdo documentado." />);
    expect(screen.getByText('Nenhum conteúdo documentado.')).toBeInTheDocument();
  });

  it('deve renderizar títulos H1, H2 e H3', () => {
    const markdown = '# Título Principal\n## Subtítulo Importante\n### Seção Menor';
    render(<MarkdownViewer content={markdown} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Título Principal');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Subtítulo Importante');
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Seção Menor');
  });

  it('deve renderizar links com target _blank e rel seguro', () => {
    const markdown = 'Acesse o [GitHub](https://github.com) para conferir.';
    render(<MarkdownViewer content={markdown} />);

    const link = screen.getByRole('link', { name: 'GitHub' });
    expect(link).toHaveAttribute('href', 'https://github.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('deve formatar texto em negrito e inline code', () => {
    const markdown = 'Este texto é **super importante** e usa `npm test`.';
    render(<MarkdownViewer content={markdown} />);

    expect(screen.getByText('super importante')).toBeInTheDocument();
    expect(screen.getByText('npm test')).toBeInTheDocument();
  });
});
