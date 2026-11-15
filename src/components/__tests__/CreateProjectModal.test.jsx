import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateProjectModal from '../CreateProjectModal';
import { projectService } from '../../services/api';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { user_id: 1, name: 'Lucas Valente' },
    token: 'mock-token'
  })
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

vi.mock('../../services/api', () => ({
  projectService: {
    createProject: vi.fn().mockResolvedValue({ project_id: 42, name: 'Novo Projeto de Teste' })
  }
}));

describe('CreateProjectModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('não deve renderizar nada quando isOpen for falso', () => {
    const { container } = render(
      <CreateProjectModal isOpen={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar campos principais quando isOpen for verdadeiro', () => {
    render(
      <CreateProjectModal isOpen={true} onClose={vi.fn()} />
    );

    expect(screen.getByRole('heading', { name: /Criar Novo Projeto/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ex: BioPrótese|Ex: Plataforma/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Explique resumidamente|Descreva o objetivo/i)).toBeInTheDocument();
  });

  it('deve permitir adicionar e remover vagas', () => {
    render(
      <CreateProjectModal isOpen={true} onClose={vi.fn()} />
    );

    // Clica para adicionar vaga
    const addRoleBtn = screen.getByRole('button', { name: /Adicionar Vaga/i });
    fireEvent.click(addRoleBtn);

    expect(screen.getByText('Vaga #1')).toBeInTheDocument();

    // Clica para remover vaga
    const removeBtn = screen.getByTitle('Remover vaga');
    fireEvent.click(removeBtn);

    expect(screen.queryByText('Vaga #1')).not.toBeInTheDocument();
  });

  it('deve chamar projectService.createProject com os dados preenchidos', async () => {
    const handleCreated = vi.fn();
    render(
      <CreateProjectModal isOpen={true} onClose={vi.fn()} onProjectCreated={handleCreated} />
    );

    const nameInput = screen.getByPlaceholderText(/Ex: BioPrótese|Ex: Plataforma/i);
    const descInput = screen.getByPlaceholderText(/Explique resumidamente|Descreva o objetivo/i);

    fireEvent.change(nameInput, { target: { value: 'EcoSensor IoT' } });
    fireEvent.change(descInput, { target: { value: 'Dispositivo para monitorar poluição em tempo real no campus.' } });

    const submitBtn = screen.getByRole('button', { name: /Criar Projeto|Lançar/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(projectService.createProject).toHaveBeenCalledWith(
        'mock-token',
        expect.objectContaining({
          name: 'EcoSensor IoT',
          description: 'Dispositivo para monitorar poluição em tempo real no campus.'
        })
      );
      expect(handleCreated).toHaveBeenCalledWith(expect.objectContaining({ project_id: 42 }));
    });
  });
});
