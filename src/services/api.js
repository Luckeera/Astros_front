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
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}/toggle-like`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Falha ao processar like no comentário');
    return response.json();
  }
};

export const collaborationService = {
  async contribute(token, postId, presentationMessage) {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/contribute`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ presentation_message: presentationMessage }),
    });
    if (!response.ok) throw new Error('Falha ao solicitar colaboração');
    return response.json();
  },

  async getCollaborations(token) {
    const response = await fetch(`${API_BASE_URL}/collaborations/`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Falha ao carregar colaborações');
    return response.json();
  },

  async getCollaborationDetails(token, collaborationId) {
    const response = await fetch(`${API_BASE_URL}/collaborations/${collaborationId}`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Falha ao carregar detalhes da conversa');
    return response.json();
  },

  async sendMessage(token, collaborationId, message) {
    const response = await fetch(`${API_BASE_URL}/collaborations/${collaborationId}/message`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ content: message }),
    });
    if (!response.ok) throw new Error('Falha ao enviar mensagem');
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
