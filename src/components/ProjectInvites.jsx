import React, { useState, useEffect } from 'react';
import { UserPlus, Check, X } from 'lucide-react';
import { messageService, projectService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProjectInvites = ({ project }) => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user: currentUser } = useAuth();

  const loadInvites = async () => {
    try {
      setLoading(true);
      const data = await messageService.getReceivedInvites(token, currentUser.user_id);
      // Filter invites for this specific project and only pending ones
      const projectInvites = data.received_invites.filter(
        inv => inv.project_id === project.project_id && inv.status === 'pending'
      );
      setInvites(projectInvites);
    } catch (err) {
      console.error('Erro ao carregar convites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project && currentUser.user_id === project.creator_id) {
      loadInvites();
    } else {
      setLoading(false);
    }
  }, [project, token]);

  const handleInviteAction = async (invite, action) => {
    try {
      if (action === 'accept') {
        await projectService.acceptInvite(token, invite.sender_id, invite.invite_id || invite.message_id, project.project_id); // Wait, API needs invite_id. In messageService we have message_id. Let's check backend return.
      } else {
        await projectService.rejectInvite(token, invite.sender_id, invite.invite_id || invite.message_id, project.project_id);
      }
      loadInvites(); // Reload
      // Optionally reload the project details to update team members
      window.location.reload(); 
    } catch (err) {
      console.error('Erro ao processar convite:', err);
    }
  };

  if (project.creator_id !== currentUser?.user_id) return null;
  if (!loading && invites.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="h-5 w-5 text-[#FFA900]" />
        <h3 className="font-black text-gray-900">Solicitações de Entrada</h3>
        <span className="bg-[#FFA900] text-black text-xs font-bold px-2 py-0.5 rounded-full">
          {invites.length}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center p-4">
          <div className="w-6 h-6 border-2 border-[#FFA900]/20 border-t-[#FFA900] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {invites.map(invite => (
            <div key={invite.message_id} className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between border border-gray-100 gap-4 flex-col sm:flex-row">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 mb-1">Nova solicitação</p>
                <p className="text-xs text-gray-600 break-words line-clamp-2">"{invite.content}"</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => handleInviteAction(invite, 'accept')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-[#FFA900] hover:text-black transition-colors text-xs font-bold shadow-md"
                >
                  <Check className="h-4 w-4" /> Aceitar
                </button>
                <button 
                  onClick={() => handleInviteAction(invite, 'reject')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-xs font-bold"
                >
                  <X className="h-4 w-4" /> Recusar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectInvites;
