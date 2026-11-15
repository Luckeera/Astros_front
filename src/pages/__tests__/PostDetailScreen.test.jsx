import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PostDetailScreen from '../PostDetailScreen';
import { postService } from '../../services/api';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useParams: () => ({ postId: '42' }),
  useNavigate: () => mockNavigate
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { user_id: 1, name: 'Lucas Valente' },
    token: 'mock-token'
  })
}));

vi.mock('../../services/api', () => ({
  postService: {
    getPostById: vi.fn(),
    toggleLike: vi.fn(),
    addComment: vi.fn(),
    toggleCommentLike: vi.fn()
  }
}));

describe('PostDetailScreen Component', () => {
  const basePost = {
    post_id: 42,
    title: 'Pesquisa com Redes Neurais',
    content: 'Análise profunda sobre aprendizado por reforço em robótica.',
    author_id: 2,
    author: {
      name: 'Beatriz Lima',
      period: 7,
      course: { name: 'Engenharia da Computação' }
    },
    created_at: new Date().toISOString(),
    is_collaborative: false,
    upvotes: 12,
    is_liked: false,
    comments: []
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('não deve exibir o bloco de documentação do projeto se post.project_id for nulo', async () => {
    postService.getPostById.mockResolvedValue(basePost);

    render(<PostDetailScreen onBack={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Pesquisa com Redes Neurais')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('post-detail-project-doc-card')).not.toBeInTheDocument();
  });

  it('deve exibir o banner de Documentação Oficial do Projeto quando post.project_id estiver presente', async () => {
    const postWithProject = {
      ...basePost,
      project_id: 88,
      project_name: 'Projeto Robótica Autônoma'
    };
    postService.getPostById.mockResolvedValue(postWithProject);

    render(<PostDetailScreen onBack={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByTestId('post-detail-project-doc-card')).toBeInTheDocument();
    });

    expect(screen.getByText('Projeto Robótica Autônoma')).toBeInTheDocument();
    expect(screen.getByText(/Documentação Oficial do Projeto/i)).toBeInTheDocument();
  });

  it('deve navegar para a tela de documentação do projeto (?tab=docs) ao clicar no card', async () => {
    const postWithProject = {
      ...basePost,
      project_id: 88,
      project_name: 'Projeto Robótica Autônoma'
    };
    postService.getPostById.mockResolvedValue(postWithProject);

    render(<PostDetailScreen onBack={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByTestId('post-detail-project-doc-card')).toBeInTheDocument();
    });

    const docCard = screen.getByTestId('post-detail-project-doc-card');
    fireEvent.click(docCard);

    expect(mockNavigate).toHaveBeenCalledWith('/projects/88?tab=docs');
  });
});
