import React from "react";
import { FolderOpenIcon } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-2">
      <div className="bg-gray-100/80 rounded-full p-2">
        <FolderOpenIcon className="w-5 h-5 text-gray-400" />
      </div>
      <p className="text-sm text-gray-500">No tasks found</p>
      <p className="text-xs text-gray-400">Add a new task to get started</p>
    </div>
  );
}
