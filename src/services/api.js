export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const THEME_COLOR = '#FFA900';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
});

export const postService = {
  async getFeed(token, courseId, filter = 'course') {
    let endpoint = `/posts/course/${courseId}`;
    if (filter === 'target') endpoint = `/posts/course/${courseId}/contributions`;
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Falha ao carregar feed');
    return response.json();
  },

  async getPostById(token, postId) {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Falha ao carregar post');
    return response.json();
  },

  async toggleLike(token, postId) {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/toggle-like-post`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Falha ao processar like');
    return response.json();
  },

  async createPost(token, postData) {
    const { target_courses, ...rest } = postData;
    const dataToSend = {
      ...rest,
      target_course_ids: target_courses || []
    };
    
    const response = await fetch(`${API_BASE_URL}/posts/`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(dataToSend),
    });
    if (!response.ok) throw new Error('Falha ao criar post');
    return response.json();
  },

  async createCollabPost(token, projectId, postData) {
    const { target_courses, ...rest } = postData;
    const dataToSend = {
      ...rest,
      target_course_ids: target_courses || [],
      is_collaborative: true
    };
    
    const response = await fetch(`${API_BASE_URL}/posts/create/collab/${projectId}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(dataToSend),
    });
    if (!response.ok) throw new Error('Falha ao criar post colaborativo');
    return response.json();
  },

  async addComment(token, postId, content, dadCommentId = null) {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/create/comment`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ content, dad_comment_id: dadCommentId }),
    });
    if (!response.ok) throw new Error('Falha ao adicionar comentário');
    return response.json();
  },

  async toggleCommentLike(token, commentId) {
    const response = await fetch(`${API_BASE_URL}/posts/comments/${commentId}/toggle-like`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Falha ao processar like no comentário');
    return response.json();
  }
};

export const messageService = {
  async getChats(token, userId) {
    const response = await fetch(`${API_BASE_URL}/messages/${userId}/chats`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Falha ao carregar conversas');
    const data = await response.json();
    return data.chats;
  },

  async getDMMessages(token, chatId) {
    const response = await fetch(`${API_BASE_URL}/messages/${chatId}/dm`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Falha ao carregar mensagens da DM');
    return response.json();
  },

  async getProjectMessages(token, projectId, chatId) {
    const response = await fetch(`${API_BASE_URL}/messages/project/${projectId}/${chatId}`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Falha ao carregar mensagens do projeto');
    return response.json();
  },

  async createDM(token, currentUserId, receiverUserId) {
    const response = await fetch(`${API_BASE_URL}/messages/create/dm/${currentUserId}/${receiverUserId}`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Falha ao criar DM');
    return response.json();
  },

  async sendPresentation(token, chatId, content, receiverId, projectId) {
    const response = await fetch(`${API_BASE_URL}/messages/${chatId}/dm/presentation/send?post_id=${projectId}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error('Falha ao enviar apresentação');
    return response.json();
  },

  async sendDMMessage(token, chatId, content) {
    const response = await fetch(`${API_BASE_URL}/messages/${chatId}/dm/send`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error('Falha ao enviar mensagem na DM');
    return response.json();
  },

  async sendProjectMessage(token, projectId, chatId, content) {
    const response = await fetch(`${API_BASE_URL}/messages/project/${projectId}/${chatId}/send`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error('Falha ao enviar mensagem no projeto');
    return response.json();
  },

  async getReceivedInvites(token, userId) {
    const response = await fetch(`${API_BASE_URL}/messages/${userId}/invites/received`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Falha ao carregar convites');
    return response.json();
  }
};

export const projectService = {
  async getUserProjects(token, userId) {
    const response = await fetch(`${API_BASE_URL}/projects/projects/${userId}`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Falha ao carregar projetos');
    return response.json();
  },

  async getProjectDetails(token, projectId) {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Falha ao carregar detalhes do projeto');
    return response.json();
  },

  async acceptInvite(token, addUserId, inviteId, projectId) {
    const response = await fetch(`${API_BASE_URL}/projects/${addUserId}/${inviteId}/${projectId}/add`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Falha ao aceitar convite');
    return response.json();
  },

  async rejectInvite(token, addUserId, inviteId, projectId) {
    const response = await fetch(`${API_BASE_URL}/projects/${addUserId}/${inviteId}/${projectId}/reject`, {
      method: 'PATCH',
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Falha ao rejeitar convite');
    return response.json();
  },

  async createProject(token, projectData) {
    const response = await fetch(`${API_BASE_URL}/projects/create`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(projectData),
    });
    if (!response.ok) throw new Error('Falha ao criar projeto');
    return response.json();
  },

  async leaveRole(token, projectId, roleId) {
    const response = await fetch(`${API_BASE_URL}/projects/leave_role/${projectId}/${roleId}`, {
      method: 'PATCH',
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Falha ao deixar função');
    return response.json();
  },

  async fillRole(token, projectId, roleId) {
    const response = await fetch(`${API_BASE_URL}/projects/fill_role/${projectId}/${roleId}`, {
      method: 'PATCH',
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Falha ao preencher função');
    return response.json();
  },

  async toggleState(token, projectId) {
    const response = await fetch(`${API_BASE_URL}/projects/change_state/${projectId}`, {
      method: 'PATCH',
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Falha ao alterar estado do projeto');
    return response.json();
  },

  async deleteProject(token, projectId) {
    const response = await fetch(`${API_BASE_URL}/projects/delete_project/${projectId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Falha ao excluir projeto');
    return response.json();
  },

  async leaveProject(token, projectId) {
    const response = await fetch(`${API_BASE_URL}/projects/leave_project/${projectId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Falha ao sair do projeto');
    return response.json();
  }
};

export const userService = {
  async getProfile(token, userId) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: getHeaders(token),
    });
    return response.json();
  }
};

export const courseService = {
  async getCourses(token) {
    const response = await fetch(`${API_BASE_URL}/courses/`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Falha ao carregar cursos');
    return response.json();
  }
};
