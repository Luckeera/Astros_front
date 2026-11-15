import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateProjectModal from '../components/CreateProjectModal';

const ProjectCreationScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <CreateProjectModal
        isOpen={true}
        onClose={() => navigate('/projects')}
        onProjectCreated={(project) => {
          if (project?.project_id) {
            navigate(`/projects/${project.project_id}`);
          } else {
            navigate('/projects');
          }
        }}
      />
    </div>
  );
};

export default ProjectCreationScreen;
