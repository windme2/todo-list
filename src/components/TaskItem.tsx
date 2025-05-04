import React, { useState } from "react";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Check, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (
    id: string,
    newText: string,
    newDetail: string,
    newPriority: "low" | "medium" | "high"
  ) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editDetail, setEditDetail] = useState(task.detail || "");
  const [editPriority, setEditPriority] = useState<"low" | "medium" | "high">(
    task.priority
  );

  const handleEdit = () => {
    if (isEditing && editText.trim()) {
      onEdit(task.id, editText, editDetail, editPriority);
      toast.success("Task updated successfully");
      setIsExpanded(!!editDetail);
    }
    setIsEditing(!isEditing);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && editText.trim()) {
      e.preventDefault();
      onEdit(task.id, editText, editDetail, editPriority);
      toast.success("Task updated successfully");
      setIsEditing(false);
      setIsExpanded(!!editDetail);
    }
  };

  const handleDelete = () => {
    onDelete(task.id);
    toast.error("Task deleted");
  };

  const handleToggle = () => {
    onToggleComplete(task.id);
    toast.success(
      task.completed ? "Task marked as incomplete" : "Task completed"
    );
  };

  const getPriorityBadge = () => {
    switch (task.priority) {
      case "low":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "medium":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "high":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const formattedDate = format(new Date(task.createdAt), "MMM d, h:mm a");

  return (
    <div
      className={cn(
        "group flex flex-col rounded-lg p-5 transition-all duration-300 w-full",
        task.completed
          ? "bg-gray-50/80 border border-gray-100"
          : "bg-white/90 border border-gray-200 shadow-sm hover:shadow-md"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleToggle}
            className={cn("h-5 w-5", task.completed ? "opacity-50" : "")}
          />
          {isEditing ? (
            <Input
              value={editText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEditText(e.target.value)
              }
              onKeyDown={handleKeyDown}
              className="flex-1"
              autoFocus
            />
          ) : (
            <div className="flex flex-col min-w-0 overflow-hidden w-full">
              <div className="flex items-center gap-3">
                <p
                  className={cn(
                    "text-sm font-medium transition-all duration-200 text-ellipsis overflow-hidden",
                    task.completed && "line-through text-gray-400"
                  )}
                >
                  {task.text}
                </p>
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full font-medium border whitespace-nowrap",
                    getPriorityBadge()
                  )}
                >
                  {task.priority}
                </span>
              </div>
              <time className="text-xs text-gray-400 mt-1">
                {formattedDate}
              </time>
            </div>
          )}
        </div>
        <div className="flex gap-2 ml-3">
          {!isEditing && task.detail && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          )}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-8 w-8 p-0"
            >
              {isEditing ? (
                <Check className="h-4 w-4" />
              ) : (
                <Edit className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete()}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {(isEditing || (isExpanded && task.detail)) && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {isEditing ? (
            <Textarea
              value={editDetail}
              onChange={(e) => setEditDetail(e.target.value)}
              placeholder="Add details (optional)..."
              className="w-full resize-none mb-3"
              rows={3}
            />
          ) : (
            task.detail && (
              <p className="text-sm text-gray-600 whitespace-pre-wrap pl-8 mb-3">
                {task.detail}
              </p>
            )
          )}

          {isEditing && (
            <RadioGroup
              value={editPriority}
              onValueChange={(value) =>
                setEditPriority(value as "low" | "medium" | "high")
              }
              className="flex space-x-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id={`low-${task.id}`} />
                <Label
                  htmlFor={`low-${task.id}`}
                  className="text-blue-600 font-medium"
                >
                  Low
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id={`medium-${task.id}`} />
                <Label
                  htmlFor={`medium-${task.id}`}
                  className="text-yellow-600 font-medium"
                >
                  Medium
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id={`high-${task.id}`} />
                <Label
                  htmlFor={`high-${task.id}`}
                  className="text-red-600 font-medium"
                >
                  High
                </Label>
              </div>
            </RadioGroup>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskItem;
