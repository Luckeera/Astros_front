import React from 'react';
import CreatePostModal from '../components/CreatePostModal';

const CreatePostScreen = ({ onCancel = () => {} }) => {
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <CreatePostModal
        isOpen={true}
        onClose={onCancel}
        onPostCreated={onCancel}
      />
    </div>
  );
};

export default CreatePostScreen;
