import React from "react";
import { Task } from "@/types/task";
import TaskItem from "./TaskItem";
import { EmptyState } from "./EmptyState";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (
    id: string,
    newText: string,
    newDetail: string,
    newPriority: "low" | "medium" | "high"
  ) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onDelete,
  onEdit,
}) => {
  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default TaskList;
