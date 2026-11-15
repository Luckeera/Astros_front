import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatWindow from '../ChatWindow';
import { messageService } from '../../services/api';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { user_id: 1, name: 'Lucas Valente' },
    token: 'mock-token'
  })
}));

vi.mock('../../services/api', () => ({
  messageService: {
    getChats: vi.fn(),
    getDMMessages: vi.fn(),
    getProjectMessages: vi.fn(),
    sendDMMessage: vi.fn(),
    sendProjectMessage: vi.fn()
  },
  projectService: {
    acceptInvite: vi.fn(),
    rejectInvite: vi.fn()
  }
}));

describe('ChatWindow Component (Modal Overlay)', () => {
  const mockChats = [
    {
      chat_id: 10,
      type: 'DM',
      unread_messages_count: 2,
      created_at: '2026-11-09T10:00:00Z',
      other_participant: { user_id: 2, name: 'Beatriz Lima' },
      project_name: null
    },
    {
      chat_id: 20,
      type: 'PROJECT',
      unread_messages_count: 0,
      created_at: '2026-11-09T11:00:00Z',
      other_participant: null,
      project_name: 'BioSensor 3D',
      project_id: 5
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    messageService.getChats.mockResolvedValue(mockChats);
    messageService.getDMMessages.mockResolvedValue({
      messages: [
        {
          message_id: 101,
          sender_id: 2,
          content: 'Olá Lucas! Gostei muito do seu pitch.',
          created_at: '2026-11-09T12:00:00Z',
          is_invite: false
        }
      ]
    });
  });

  it('não deve renderizar quando isOpen for falso', () => {
    const { container } = render(<ChatWindow isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar a lista de conversas quando aberto em modal', async () => {
    render(<ChatWindow isOpen={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Beatriz Lima')).toBeInTheDocument();
      expect(screen.getByText('BioSensor 3D')).toBeInTheDocument();
    });
  });

  it('deve filtrar conversas pela barra de busca', async () => {
    render(<ChatWindow isOpen={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Beatriz Lima')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Pesquisar conversas/i);
    fireEvent.change(searchInput, { target: { value: 'BioSensor' } });

    expect(screen.queryByText('Beatriz Lima')).not.toBeInTheDocument();
    expect(screen.getByText('BioSensor 3D')).toBeInTheDocument();
  });

  it('deve abrir conversa ativa e enviar mensagem', async () => {
    messageService.sendDMMessage.mockResolvedValue({
      message_id: 102,
      sender_id: 1,
      content: 'Opa Beatriz! Vamos marcar uma call.',
      created_at: '2026-11-09T12:05:00Z',
      is_invite: false
    });

    render(<ChatWindow isOpen={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Beatriz Lima')).toBeInTheDocument();
    });

    // Clica na conversa com Beatriz
    fireEvent.click(screen.getByText('Beatriz Lima'));

    await waitFor(() => {
      expect(screen.getByText('Olá Lucas! Gostei muito do seu pitch.')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Digite sua mensagem|Diga algo/i);
    fireEvent.change(input, { target: { value: 'Opa Beatriz! Vamos marcar uma call.' } });

    const sendBtn = screen.getByTitle('Enviar mensagem') || screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(messageService.sendDMMessage).toHaveBeenCalledWith(
        'mock-token',
        10,
        'Opa Beatriz! Vamos marcar uma call.'
      );
    });
  });
});
