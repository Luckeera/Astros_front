import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CommentItem from '../CommentItem';

describe('CommentItem Component', () => {
  const mockComment = {
    comment_id: 1,
    content: 'Comentário excelente!',
    upvotes: 4,
    is_liked: false,
    created_at: '2026-11-09T12:00:00Z',
    author: { name: 'Camila Code' },
    replies: [
      {
        comment_id: 2,
        content: 'Resposta de teste',
        upvotes: 1,
        is_liked: true,
        created_at: '2026-11-09T13:00:00Z',
        author: { name: 'João Dev' },
        replies: []
      }
    ]
  };

  it('deve renderizar autor, conteúdo e contagem de upvotes', () => {
    render(<CommentItem comment={mockComment} onReply={vi.fn()} onToggleLike={vi.fn()} />);

    expect(screen.getByText('Camila Code')).toBeInTheDocument();
    expect(screen.getByText('Comentário excelente!')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('deve renderizar respostas aninhadas recursivamente', () => {
    render(<CommentItem comment={mockComment} onReply={vi.fn()} onToggleLike={vi.fn()} />);

    expect(screen.getByText('João Dev')).toBeInTheDocument();
    expect(screen.getByText('Resposta de teste')).toBeInTheDocument();
  });

  it('deve chamar onToggleLike e onReply ao clicar nos botões', () => {
    const handleLike = vi.fn();
    const handleReply = vi.fn();

    render(<CommentItem comment={mockComment} onReply={handleReply} onToggleLike={handleLike} />);

    // Clica no like do comentário principal
    const likeButtons = screen.getAllByRole('button');
    fireEvent.click(likeButtons[0]);
    expect(handleLike).toHaveBeenCalledWith(1);

    // Clica em responder
    const replyButtons = screen.getAllByText(/Responder/i);
    fireEvent.click(replyButtons[0]);
    expect(handleReply).toHaveBeenCalledWith(mockComment);
  });
});
