import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectUpdatesTimeline from '../ProjectUpdatesTimeline';

describe('ProjectUpdatesTimeline Component', () => {
  it('deve exibir estado vazio quando não houver atualizações', () => {
    render(<ProjectUpdatesTimeline updates={[]} isMember={false} />);
    expect(screen.getByText('Nenhum evento registrado ainda.')).toBeInTheDocument();
  });

  it('deve renderizar botão de novo marco para integrantes e disparar callback', () => {
    const handleOpenModal = vi.fn();
    render(
      <ProjectUpdatesTimeline 
        updates={[]} 
        isMember={true} 
        onOpenNewUpdateModal={handleOpenModal} 
      />
    );

    const button = screen.getByRole('button', { name: /Novo Marco \/ Atualização/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleOpenModal).toHaveBeenCalledTimes(1);
  });

  it('não deve exibir botão de novo marco para visitantes não-integrantes', () => {
    render(<ProjectUpdatesTimeline updates={[]} isMember={false} />);
    expect(screen.queryByRole('button', { name: /Novo Marco \/ Atualização/i })).not.toBeInTheDocument();
  });

  it('deve renderizar a lista de atualizações com badges e títulos correspondentes', () => {
    const updates = [
      {
        update_id: 1,
        title: 'Lançamento do MVP',
        content: 'Finalizamos os primeiros módulos do projeto.',
        tag: 'Marco',
        update_type: 'manual',
        author_name: 'Lucas Valente',
        created_at: '2026-11-09T18:00:00Z',
      },
      {
        update_id: 2,
        title: 'Vaga Preenchida',
        content: 'Mariana assumiu a vaga de Designer.',
        tag: 'Equipe',
        update_type: 'system',
        created_at: '2026-11-09T19:00:00Z',
      },
    ];

    render(<ProjectUpdatesTimeline updates={updates} isMember={false} />);

    expect(screen.getByText('Lançamento do MVP')).toBeInTheDocument();
    expect(screen.getByText('Finalizamos os primeiros módulos do projeto.')).toBeInTheDocument();
    expect(screen.getByText('Lucas Valente')).toBeInTheDocument();
    expect(screen.getByText('Vaga Preenchida')).toBeInTheDocument();
    expect(screen.getByText('Log do Sistema')).toBeInTheDocument();
  });
});
