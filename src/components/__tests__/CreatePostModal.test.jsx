import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreatePostModal from '../CreatePostModal';
import { postService, courseService, projectService } from '../../services/api';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { user_id: 1, name: 'Lucas Valente', course_id: 1 },
    token: 'mock-token'
  })
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

vi.mock('../../services/api', () => ({
  postService: {
    createPost: vi.fn(),
    createCollabPost: vi.fn()
  },
  courseService: {
    getCourses: vi.fn()
  },
  projectService: {
    getUserProjects: vi.fn()
  },
  macroAreaService: {
    getMacroAreas: vi.fn().mockResolvedValue([
      { macro_area_id: 1, name: 'Desenvolvimento de Software & TI', description: 'Código e infra' },
      { macro_area_id: 2, name: 'Design, UI/UX & Criatividade Visual', description: 'Design e protótipos' },
      { macro_area_id: 8, name: 'Saúde, Biológicas & Bem-Estar', description: 'Saúde e bio' }
    ])
  }
}));

describe('CreatePostModal Component', () => {
  const mockCourses = [
    { course_id: 1, name: 'Engenharia de Software', area: 'Tecnologia' },
    { course_id: 2, name: 'Ciência da Computação', area: 'Tecnologia' },
    { course_id: 3, name: 'Medicina', area: 'Saúde' }
  ];

  const mockProjects = [
    { project_id: 10, name: 'BioSensor 3D' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    courseService.getCourses.mockResolvedValue(mockCourses);
    projectService.getUserProjects.mockResolvedValue(mockProjects);
    postService.createPost.mockResolvedValue({ post_id: 100, title: 'Meu Artigo' });
    postService.createCollabPost.mockResolvedValue({ post_id: 101, title: 'Pitch de Projeto' });
  });

  it('não deve renderizar nada quando isOpen for falso', () => {
    const { container } = render(
      <CreatePostModal isOpen={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar campos principais quando isOpen for verdadeiro', async () => {
    render(<CreatePostModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByRole('heading', { name: /Publicar no Feed|Nova Publicação/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Desenvolvendo sistema|Título da sua publicação/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Descreva sua ideia/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Desenvolvimento de Software & TI')).toBeInTheDocument();
    });
  });

  it('deve permitir selecionar e desselecionar macro áreas alvo', async () => {
    render(<CreatePostModal isOpen={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Desenvolvimento de Software & TI')).toBeInTheDocument();
    });

    const macroBtn = screen.getByText('Desenvolvimento de Software & TI');
    fireEvent.click(macroBtn);

    // A macro área agora deve estar selecionada
    expect(macroBtn.closest('div.border-2')).toHaveClass('border-[#FFA900]');
  });

  it('deve submeter publicação comum e chamar postService.createPost', async () => {
    const handleCreated = vi.fn();
    render(<CreatePostModal isOpen={true} onClose={vi.fn()} onPostCreated={handleCreated} />);

    await waitFor(() => {
      expect(screen.getByText('Desenvolvimento de Software & TI')).toBeInTheDocument();
    });

    const titleInput = screen.getByPlaceholderText(/Desenvolvendo sistema|Título da sua publicação/i);
    const contentInput = screen.getByPlaceholderText(/Descreva sua ideia/i);

    fireEvent.change(titleInput, { target: { value: 'Nova pesquisa em Redes Neurais' } });
    fireEvent.change(contentInput, { target: { value: 'Apresentamos um estudo preliminar sobre otimização de pesos.' } });

    const submitBtn = screen.getByRole('button', { name: /Publicar/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(postService.createPost).toHaveBeenCalledWith(
        'mock-token',
        expect.objectContaining({
          title: 'Nova pesquisa em Redes Neurais',
          content: 'Apresentamos um estudo preliminar sobre otimização de pesos.',
          is_collaborative: false
        })
      );
      expect(handleCreated).toHaveBeenCalledWith(expect.objectContaining({ post_id: 100 }));
    });
  });

  it('deve permitir ativar modo colaborativo e vincular a um projeto', async () => {
    const handleCreated = vi.fn();
    render(<CreatePostModal isOpen={true} onClose={vi.fn()} onPostCreated={handleCreated} />);

    await waitFor(() => {
      expect(screen.getByText('Colaboração Acadêmica')).toBeInTheDocument();
    });

    // Ativa colaboração
    const collabToggle = screen.getByText('Colaboração Acadêmica');
    fireEvent.click(collabToggle);

    await waitFor(() => {
      expect(screen.getByText(/Vincular a um Projeto/i)).toBeInTheDocument();
    });

    const projectSelect = screen.getByRole('combobox');
    fireEvent.change(projectSelect, { target: { value: '10' } });

    const titleInput = screen.getByPlaceholderText(/Desenvolvendo sistema|Título da sua publicação/i);
    const contentInput = screen.getByPlaceholderText(/Descreva sua ideia/i);

    fireEvent.change(titleInput, { target: { value: 'Buscamos Desenvolvedores React' } });
    fireEvent.change(contentInput, { target: { value: 'Vagas abertas para o projeto BioSensor 3D.' } });

    const submitBtn = screen.getByRole('button', { name: /Publicar/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(postService.createCollabPost).toHaveBeenCalledWith(
        'mock-token',
        '10',
        expect.objectContaining({
          title: 'Buscamos Desenvolvedores React',
          content: 'Vagas abertas para o projeto BioSensor 3D.'
        })
      );
    });
  });

  it('deve permitir filtrar macro áreas pelo campo de busca', async () => {
    render(<CreatePostModal isOpen={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Desenvolvimento de Software & TI')).toBeInTheDocument();
      expect(screen.getByText('Saúde, Biológicas & Bem-Estar')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Filtrar por habilidade/i);
    fireEvent.change(searchInput, { target: { value: 'Saúde' } });

    await waitFor(() => {
      expect(screen.getByText('Saúde, Biológicas & Bem-Estar')).toBeInTheDocument();
      expect(screen.queryByText('Desenvolvimento de Software & TI')).not.toBeInTheDocument();
    });
  });

  it('deve permitir vincular um projeto a um post comum sem colaboração', async () => {
    const handleCreated = vi.fn();
    render(<CreatePostModal isOpen={true} onClose={vi.fn()} onPostCreated={handleCreated} />);

    await waitFor(() => {
      expect(screen.getByText(/Vincular a um Projeto/i)).toBeInTheDocument();
    });

    const projectSelect = screen.getByRole('combobox');
    fireEvent.change(projectSelect, { target: { value: '10' } });

    const titleInput = screen.getByPlaceholderText(/Desenvolvendo sistema|Título da sua publicação/i);
    const contentInput = screen.getByPlaceholderText(/Descreva sua ideia/i);

    fireEvent.change(titleInput, { target: { value: 'Artigo sobre Arquitetura do BioSensor' } });
    fireEvent.change(contentInput, { target: { value: 'Confira a documentação completa do projeto.' } });

    const submitBtn = screen.getByRole('button', { name: /Publicar/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(postService.createPost).toHaveBeenCalledWith(
        'mock-token',
        expect.objectContaining({
          title: 'Artigo sobre Arquitetura do BioSensor',
          content: 'Confira a documentação completa do projeto.',
          is_collaborative: false,
          project_id: 10
        })
      );
    });
  });
});
