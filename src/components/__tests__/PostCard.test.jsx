import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PostCard from '../PostCard';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
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
    toggleLike: vi.fn()
  }
}));

describe('PostCard Component', () => {
  const basePost = {
    post_id: 1,
    title: 'Publicação Científica',
    content: 'Conteúdo descritivo da publicação acadêmica.',
    author_id: 2,
    author: {
      name: 'Maria Santos',
      period: 5,
      course: { name: 'Biotecnologia' }
    },
    created_at: new Date().toISOString(),
    is_collaborative: false,
    upvotes: 3,
    is_liked: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('não deve exibir badge de documentação quando o post não tem project_id', () => {
    const onNavigateToDetail = vi.fn();
    render(<PostCard post={basePost} onNavigateToDetail={onNavigateToDetail} />);

    expect(screen.queryByTestId('post-project-doc-badge')).not.toBeInTheDocument();
    expect(screen.queryByText(/Documentação Oficial|Ver Documentação/i)).not.toBeInTheDocument();
  });

  it('deve exibir badge de documentação do projeto quando post.project_id estiver presente', () => {
    const onNavigateToDetail = vi.fn();
    const postWithProject = {
      ...basePost,
      project_id: 99,
      project_name: 'Satélite Cubesat'
    };

    render(<PostCard post={postWithProject} onNavigateToDetail={onNavigateToDetail} />);

    const badge = screen.getByTestId('post-project-doc-badge');
    expect(badge).toBeInTheDocument();
    expect(screen.getByText(/Satélite Cubesat/i)).toBeInTheDocument();
  });

  it('deve navegar para a tela de documentação do projeto (?tab=docs) ao clicar no badge sem abrir o detalhe do post', () => {
    const onNavigateToDetail = vi.fn();
    const postWithProject = {
      ...basePost,
      project_id: 99,
      project_name: 'Satélite Cubesat'
    };

    render(<PostCard post={postWithProject} onNavigateToDetail={onNavigateToDetail} />);

    const badge = screen.getByTestId('post-project-doc-badge');
    fireEvent.click(badge);

    expect(mockNavigate).toHaveBeenCalledWith('/projects/99?tab=docs');
    expect(onNavigateToDetail).not.toHaveBeenCalled();
  });
});
