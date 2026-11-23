import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  postService, 
  messageService, 
  projectService, 
  userService, 
  courseService 
} from '../api';

describe('Serviço Central de API (services/api.js)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('postService', () => {
    it('getFeed deve chamar o endpoint correto de macro-area com token', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ post_id: 1, title: 'Post Teste' }],
      });

      const res = await postService.getFeed('fake-token', 1, 'macro_area', 2);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/posts/macro-area/1?secondary_id=2'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer fake-token',
          }),
        })
      );
      expect(res).toEqual([{ post_id: 1, title: 'Post Teste' }]);
    });

    it('getFeed deve chamar o endpoint colaborativo de macro-area quando filter for target', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ post_id: 2, title: 'Pitch Teste' }],
      });

      const res = await postService.getFeed('fake-token', 1, 'target');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/posts/macro-area/1/contributions'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer fake-token',
          }),
        })
      );
      expect(res).toEqual([{ post_id: 2, title: 'Pitch Teste' }]);
    });

    it('toggleLike deve fazer POST para toggle-like-post', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'liked', current_upvotes: 5 }),
      });

      const res = await postService.toggleLike('fake-token', 42);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/posts/42/toggle-like-post'),
        expect.objectContaining({ method: 'POST' })
      );
      expect(res.status).toBe('liked');
    });

    it('createPost deve serializar target_course_ids e target_macro_area_ids corretamente', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ post_id: 99, title: 'Novo Post' }),
      });

      await postService.createPost('fake-token', {
        title: 'Novo Post',
        content: 'Conteúdo...',
        target_courses: [1, 2],
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/posts/'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            title: 'Novo Post',
            content: 'Conteúdo...',
            target_course_ids: [1, 2],
            target_macro_area_ids: [],
          }),
        })
      );
    });

    it('addComment deve enviar dad_comment_id quando fornecido', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comment_id: 10, content: 'Resposta', dad_comment_id: 5 }),
      });

      const res = await postService.addComment('token', 1, 'Resposta', 5);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/posts/1/create/comment'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ content: 'Resposta', dad_comment_id: 5 }),
        })
      );
      expect(res.dad_comment_id).toBe(5);
    });
  });

  describe('messageService', () => {
    it('createDM deve chamar rota com currentUserId e receiverUserId', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'DM created', chat_id: 12 }),
      });

      const res = await messageService.createDM('token', 1, 2);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/messages/create/dm/1/2'),
        expect.objectContaining({ method: 'POST' })
      );
      expect(res.chat_id).toBe(12);
    });

    it('sendPresentation deve anexar post_id na query string', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ is_invite: true, invite_id: 3 }),
      });

      await messageService.sendPresentation('token', 12, 'Olá, quero colaborar!', 2, 7);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/messages/12/dm/presentation/send?post_id=7'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ content: 'Olá, quero colaborar!' }),
        })
      );
    });
  });

  describe('projectService', () => {
    it('updateDocumentation deve enviar PUT com documentação markdown', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Atualizado com sucesso' }),
      });

      await projectService.updateDocumentation('token', 5, '# Documentação');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/projects/5/documentation'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ documentation: '# Documentação' }),
        })
      );
    });

    it('addProjectUpdate deve postar novo marco de atualização', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, title: 'Marco Alfa', tag: 'Marco' }),
      });

      await projectService.addProjectUpdate('token', 5, {
        title: 'Marco Alfa',
        content: 'Detalhes...',
        tag: 'Marco',
      });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/projects/5/updates'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ title: 'Marco Alfa', content: 'Detalhes...', tag: 'Marco' }),
        })
      );
    });

    it('updateProjectInfo deve enviar PATCH para /projects/:id/info', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ project_id: 5, name: 'Novo Nome', description: 'Nova Desc' }),
      });

      const res = await projectService.updateProjectInfo('token', 5, {
        name: 'Novo Nome',
        description: 'Nova Desc',
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/projects/5/info'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ name: 'Novo Nome', description: 'Nova Desc' }),
        })
      );
      expect(res.name).toBe('Novo Nome');
    });

    it('addProjectRole deve enviar POST para /projects/:id/roles', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ project_id: 5, roles: [] }),
      });

      await projectService.addProjectRole('token', 5, {
        role_name: 'Dev React',
        role_quantity: 1,
        role_explanation: 'Trabalhar no front',
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/projects/5/roles'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            role_name: 'Dev React',
            role_quantity: 1,
            role_explanation: 'Trabalhar no front',
          }),
        })
      );
    });

    it('deleteProjectRole deve enviar DELETE para /projects/:id/roles/:roleId', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Vaga removida' }),
      });

      const res = await projectService.deleteProjectRole('token', 5, 42);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/projects/5/roles/42'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
      expect(res.message).toBe('Vaga removida');
    });
  });

  describe('userService & courseService', () => {
    it('register deve enviar dados do usuário incluindo course_area', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user_id: 1, name: 'Lucas' }),
      });

      await userService.register({
        name: 'Lucas',
        email: 'lucas@test.com',
        password: 'senhaSegura123',
        course_name: 'Engenharia de Software',
        course_area: 'Tecnologia',
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"course_area":"Tecnologia"'),
        })
      );
    });

    it('getCourses deve listar cursos disponíveis', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ course_id: 1, name: 'Direito', area: 'Direito' }],
      });

      const courses = await courseService.getCourses('token');
      expect(courses).toHaveLength(1);
      expect(courses[0].area).toBe('Direito');
    });
  });
});
