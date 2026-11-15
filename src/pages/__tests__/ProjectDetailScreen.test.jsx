import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ProjectDetailScreen from '../ProjectDetailScreen';
import { projectService } from '../../services/api';

let mockSearchParams = new URLSearchParams('');

vi.mock('react-router-dom', () => ({
  useParams: () => ({ projectId: '10' }),
  useNavigate: () => vi.fn(),
  useSearchParams: () => [mockSearchParams]
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { user_id: 1, name: 'Lucas Valente' },
    token: 'mock-token'
  })
}));

vi.mock('../../services/api', () => ({
  projectService: {
    getProjectDetails: vi.fn(),
    getProjectUpdates: vi.fn(),
    addProjectUpdate: vi.fn(),
    updateProjectInfo: vi.fn(),
    saveProjectDoc: vi.fn(),
    addProjectRole: vi.fn(),
    leaveProject: vi.fn(),
    deleteProject: vi.fn(),
    toggleProjectStatus: vi.fn()
  }
}));

// Mock dos subcomponentes para isolar o teste de aba e roteamento
vi.mock('../../components/ProjectChatSection', () => ({
  default: () => <div data-testid="mock-chat-section">Chat Section</div>
}));
vi.mock('../../components/ProjectInvites', () => ({
  default: () => <div data-testid="mock-invites">Invites</div>
}));
vi.mock('../../components/MarkdownViewer', () => ({
  default: ({ content }) => <div data-testid="mock-markdown">{content}</div>
}));
vi.mock('../../components/ProjectUpdatesTimeline', () => ({
  default: () => <div data-testid="mock-timeline">Timeline</div>
}));

describe('ProjectDetailScreen - Tab docs query param', () => {
  const mockProjectAsLeader = {
    project_id: 10,
    name: 'Rover Lunar',
    description: 'Exploração robótica de solo lunar.',
    creator_id: 1,
    creator_name: 'Lucas Valente',
    user_role: 'Líder',
    status: 'active',
    documentation: '# Manual Técnico do Rover\nEspecificações detalhadas.',
    participants_info: [
      { user_id: 1, name: 'Lucas Valente', role: 'Líder' }
    ],
    roles: []
  };

  beforeEach(() => {
    vi.clearAllMocks();
    projectService.getProjectDetails.mockResolvedValue(mockProjectAsLeader);
    projectService.getProjectUpdates.mockResolvedValue([]);
  });

  it('deve abrir a aba Painel da Equipe por padrão para o líder quando tab=docs não estiver presente', async () => {
    mockSearchParams = new URLSearchParams('');

    render(<ProjectDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText('Rover Lunar')).toBeInTheDocument();
    });

    // Como o usuário é líder e não passou tab=docs, deve exibir Painel
    expect(screen.getByText('Painel da Equipe')).toBeInTheDocument();
    expect(screen.getByTestId('mock-chat-section')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-markdown')).not.toBeInTheDocument();
  });

  it('deve ativar a aba Documentação Oficial quando ?tab=docs for informado na URL', async () => {
    mockSearchParams = new URLSearchParams('tab=docs');

    render(<ProjectDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText(/Rover Lunar/i)).toBeInTheDocument();
    });

    // Deve exibir o viewer de documentação
    expect(screen.getByTestId('mock-markdown')).toBeInTheDocument();
    expect(screen.getByText(/# Manual Técnico do Rover/i)).toBeInTheDocument();
  });
});
