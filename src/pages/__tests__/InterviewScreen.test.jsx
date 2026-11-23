import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import InterviewScreen from '../InterviewScreen';
import { projectService, interviewService } from '../../services/api';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    token: null
  })
}));

vi.mock('../../services/api', () => ({
  projectService: {
    getMuralProjects: vi.fn().mockResolvedValue([
      {
        project_id: 1,
        name: 'Projeto Real Banco',
        description: 'Projeto vindo do banco de dados para o mural.',
        area: 'Tecnologia',
        is_suggested: false,
        creator_name: 'Ana',
        creator_course: 'Design',
        roles: []
      }
    ])
  },
  interviewService: {
    submitInterview: vi.fn().mockResolvedValue({
      status: 'success',
      user_id: 1,
      user_name: 'Lucas Teste',
      created_project_id: 10,
      created_projects_count: 2,
      created_project_ids: [10, 11],
      invites_sent_count: 0
    })
  },
  macroAreaService: {
    getMacroAreas: vi.fn().mockResolvedValue([])
  }
}));

describe('InterviewScreen Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('permite apagar todas as vagas na Etapa 2 e exibe estado vazio amigável', async () => {
    render(
      <BrowserRouter>
        <InterviewScreen />
      </BrowserRouter>
    );

    // 1. Preenche dados obrigatórios da Etapa 1
    const nameInput = screen.getByPlaceholderText(/Ex: Lucas Valente/i);
    const emailInput = screen.getByPlaceholderText(/seu.email@universidade.edu.br/i);
    const collegeInput = screen.getByPlaceholderText(/Ex: UFPE, UFRPE, Católica, etc\./i);
    const courseInput = screen.getByPlaceholderText(/Ex: Ciência da Computação, Direito, Design\.\.\./i);

    fireEvent.change(nameInput, { target: { value: 'Lucas Teste' } });
    fireEvent.change(emailInput, { target: { value: 'lucas@teste.com' } });
    fireEvent.change(collegeInput, { target: { value: 'Universidade Católica' } });
    fireEvent.change(courseInput, { target: { value: 'Sistemas para Internet' } });

    // Avança para a Etapa 2
    const nextBtn = screen.getByText(/Próxima Etapa/i);
    expect(nextBtn).toBeEnabled();
    fireEvent.click(nextBtn);

    // 2. Na Etapa 2, clica em "Sim, quero cadastrar 🚀" na Pergunta 11
    const wantCreateBtn = await screen.findByRole('button', { name: /Sim, quero cadastrar 🚀/i });
    fireEvent.click(wantCreateBtn);

    // Vagas iniciais (UI/UX Designer e Desenvolvedor) devem estar visíveis
    expect(screen.getByDisplayValue(/UI\/UX Designer/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Desenvolvedor/i)).toBeInTheDocument();

    // Encontra os botões de lixeira (devem ser 2)
    let trashButtons = screen.getAllByTitle(/Remover esta vaga/i);
    expect(trashButtons).toHaveLength(2);

    // Remove a primeira vaga
    fireEvent.click(trashButtons[0]);
    trashButtons = screen.getAllByTitle(/Remover esta vaga/i);
    expect(trashButtons).toHaveLength(1);

    // Remove a segunda vaga (última vaga restante)
    fireEvent.click(trashButtons[0]);

    // Agora a lista está zerada: o estado vazio informativo deve aparecer!
    expect(screen.getByText(/Nenhuma vaga em aberto cadastrada no momento/i)).toBeInTheDocument();
    expect(screen.getByText(/O projeto será criado sem vagas extras/i)).toBeInTheDocument();

    // Deve permitir adicionar uma nova vaga pelo botão do estado vazio
    const addFirstRoleBtn = screen.getByRole('button', { name: /Adicionar Primeira Vaga/i });
    fireEvent.click(addFirstRoleBtn);

    // Agora há 1 vaga nova adicionada
    expect(screen.getByPlaceholderText(/Nome da Vaga \(ex: UI Designer\)/i)).toBeInTheDocument();
  });

  it('permite cadastrar projeto próprio na Etapa 2 e adotar ideia na Etapa 3 criando ambos', async () => {
    render(
      <BrowserRouter>
        <InterviewScreen />
      </BrowserRouter>
    );

    // Etapa 1
    fireEvent.change(screen.getByPlaceholderText(/Ex: Lucas Valente/i), { target: { value: 'Lucas Valente' } });
    fireEvent.change(screen.getByPlaceholderText(/seu.email@universidade.edu.br/i), { target: { value: 'lucas@valente.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Ex: UFPE, UFRPE, Católica, etc\./i), { target: { value: 'UFPE' } });
    fireEvent.change(screen.getByPlaceholderText(/Ex: Ciência da Computação, Direito, Design\.\.\./i), { target: { value: 'Ciência da Computação' } });

    fireEvent.click(screen.getByText(/Próxima Etapa/i));

    // Etapa 2: Cadastra projeto próprio
    const wantCreateBtn = await screen.findByRole('button', { name: /Sim, quero cadastrar 🚀/i });
    fireEvent.click(wantCreateBtn);

    const projNameInput = screen.getByPlaceholderText(/Ex: EcoUbíqua, App de Saúde Mental Universitária\.\.\./i);
    const projDescInput = screen.getByPlaceholderText(/Explique o problema que resolve e o que vocês pretendem construir/i);

    fireEvent.change(projNameInput, { target: { value: 'Meu Projeto Próprio' } });
    fireEvent.change(projDescInput, { target: { value: 'Descrição detalhada com mais de dez caracteres.' } });

    fireEvent.click(screen.getByText(/Próxima Etapa/i));

    // Etapa 3: Degustação do Mural
    await screen.findByText(/12\. Degustação do Mural de Projetos/i);

    // Clica no Preview de uma ideia sugerida (mock)
    const suggestedIdeaBadges = screen.getAllByText(/💡 Ideia Sugerida/i);
    expect(suggestedIdeaBadges.length).toBeGreaterThan(0);
    const mockCard = suggestedIdeaBadges[0].closest('div.rounded-2xl');
    const previewBtn = within(mockCard).getByText(/Ver Preview/i);
    fireEvent.click(previewBtn);

    // Clica em "Quero Adotar Esta Ideia 🚀"
    const adoptButton = await screen.findByRole('button', { name: /Quero Adotar Esta Ideia 🚀/i });
    fireEvent.click(adoptButton);

    // O banner de ideias adotadas deve aparecer na Etapa 3 (sem chutar de volta para a etapa 2)
    await screen.findByText(/Ideias Adotadas para Liderar/i);

    // Avança para a Etapa 4
    fireEvent.click(screen.getByText(/Próxima Etapa/i));

    // Etapa 4: Validação
    await screen.findByText(/Validação da Proposta de Valor/i);
    fireEvent.click(screen.getByText(/Com certeza! Mandaria mensagem imediatamente para combinar como ajudar/i));
    fireEvent.click(screen.getByText(/Sim, com certeza! A faculdade ensina muita teoria isolada e o mercado exige visão prática multidisciplinar/i));

    // Avança para a Etapa 5 (Revisão)
    fireEvent.click(screen.getByText(/Próxima Etapa/i));

    // Etapa 5: Ambos os projetos devem estar listados!
    await screen.findByText(/2\. Publicação de Projeto\(s\) no Mural/i);
    expect(screen.getByText(/Projeto Próprio: "Meu Projeto Próprio"/i)).toBeInTheDocument();
    expect(screen.getByText(/Ideia Adotada do Mural:/i)).toBeInTheDocument();

    // Submete a entrevista
    const submitBtn = screen.getByRole('button', { name: /Finalizar Entrevista & Ativar Participação 🚀/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(interviewService.submitInterview).toHaveBeenCalledTimes(1);
    });

    const sentPayload = interviewService.submitInterview.mock.calls[0][0];
    expect(sentPayload.proposed_projects).toHaveLength(2);
    expect(sentPayload.proposed_projects[0].name).toBe('Meu Projeto Próprio');
    expect(sentPayload.wants_to_create_project).toBe(true);
  });

  it('permite buscar e selecionar até 2 macro áreas por card, respeitando o limite máximo', async () => {
    render(
      <BrowserRouter>
        <InterviewScreen />
      </BrowserRouter>
    );

    // Deve exibir o título da seção de macro área
    expect(screen.getByText(/Macro Áreas de Habilidades Práticas/i)).toBeInTheDocument();
    expect(screen.getByText(/Escolha até 2/i)).toBeInTheDocument();

    // Deve permitir filtrar pelo campo de busca
    const searchInput = screen.getByPlaceholderText(/Filtrar por habilidade ou área prática/i);
    fireEvent.change(searchInput, { target: { value: 'Design' } });

    // Encontra o card de Design
    const designCard = screen.getByText(/Design, UI\/UX & Criatividade Visual/i);
    expect(designCard).toBeInTheDocument();

    // Clica para selecionar a 1ª macro área
    fireEvent.click(designCard);
    expect(screen.getByText(/1ª Área/i)).toBeInTheDocument();
    expect(screen.getByText(/1\/2 selecionada/i)).toBeInTheDocument();

    // Limpa a busca para achar outra área
    fireEvent.change(searchInput, { target: { value: 'Software' } });
    const softwareCard = screen.getByText(/Desenvolvimento de Software & TI/i);
    expect(softwareCard).toBeInTheDocument();

    // Clica para selecionar a 2ª macro área
    fireEvent.click(softwareCard);
    expect(screen.getByText(/2ª Área/i)).toBeInTheDocument();
    expect(screen.getByText(/2\/2 selecionadas/i)).toBeInTheDocument();

    // Tenta selecionar uma 3ª macro área (ex: Dados)
    fireEvent.change(searchInput, { target: { value: 'Dados' } });
    const dadosCard = screen.getByText(/Dados, Inteligência Artificial & Analytics/i);
    fireEvent.click(dadosCard);

    // Deve exibir aviso amigável de limite máximo de 2
    expect(screen.getByText(/Você já selecionou o limite máximo de 2 macro áreas práticas/i)).toBeInTheDocument();

    // Botão Limpar Seleção deve estar visível
    const clearBtn = screen.getByRole('button', { name: /Limpar Seleção/i });
    expect(clearBtn).toBeInTheDocument();

    // Clica no botão Limpar Seleção
    fireEvent.click(clearBtn);
    expect(screen.queryByText(/1ª Área/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/2ª Área/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Escolha até 2/i)).toBeInTheDocument();
  });
});
