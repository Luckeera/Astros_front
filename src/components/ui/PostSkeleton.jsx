import React from 'react';

const PostSkeleton = () => (
  <div className="bg-white p-10 rounded-3xl border border-gray-100 space-y-8 animate-pulse shadow-sm">
    <div className="flex gap-4">
      <div className="h-14 w-14 bg-gray-50 rounded-xl" />
      <div className="space-y-3 flex-1 pt-1">
        <div className="h-4 w-32 bg-gray-50 rounded-md" />
        <div className="h-3 w-48 bg-gray-50 rounded-md" />
      </div>
    </div>
    <div className="h-10 w-full bg-gray-50 rounded-xl" />
  </div>
);

export default PostSkeleton;
