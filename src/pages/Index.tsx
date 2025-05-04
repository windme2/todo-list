import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import { Task } from "@/types/task";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";

type FilterType = "all" | "active" | "completed";

const Index: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks).map((task: Partial<Task>) => ({
          ...task,
          createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
          priority: task.priority || "medium",
        }));
      } catch (error) {
        console.error("Failed to parse saved tasks:", error);
      }
    }
    return [];
  });

  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (
    text: string,
    detail: string,
    priority: "low" | "medium" | "high"
  ) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      detail: detail.trim() || undefined,
      completed: false,
      createdAt: new Date(),
      priority,
    };
    setTasks([...tasks, newTask]);
    toast.success("Task added successfully");
  };

  const handleToggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    toast.success("Task status updated");
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast.error("Task deleted");
  };

  const handleEditTask = (
    id: string,
    newText: string,
    newDetail: string,
    newPriority: "low" | "medium" | "high"
  ) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              text: newText,
              detail: newDetail.trim() || undefined,
              priority: newPriority,
            }
          : task
      )
    );
    toast.info("Task updated");
  };

  const filteredTasks = tasks.filter((task) => {
    return (
      filter === "all" ||
      (filter === "active" && !task.completed) ||
      (filter === "completed" && task.completed)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 px-4 py-5 transition-all duration-500">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-none bg-white/95 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl rounded-xl overflow-hidden">
          <CardHeader className="pb-3 pt-5 px-4 border-b border-gray-100/20">
            <div className="text-center space-y-1.5">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-fade-in">
                Todo List
              </h1>
              <p className="text-sm text-gray-600 animate-fade-in animation-delay-200">
                Manage your tasks efficiently and stay organized
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-4">
            <div className="bg-gray-50/70 p-4 rounded-lg shadow-inner transition-all duration-300 hover:bg-gray-50/90">
              <TaskInput onAddTask={handleAddTask} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <Filter className="h-4 w-4 text-indigo-500" />
                <span className="font-medium text-gray-700">View Tasks</span>
              </div>

              <Tabs
                defaultValue="all"
                value={filter}
                onValueChange={(value) => setFilter(value as FilterType)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 bg-gray-100/80 p-1 rounded-lg gap-1">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all duration-200 px-3 py-1.5"
                  >
                    All Tasks
                  </TabsTrigger>
                  <TabsTrigger
                    value="active"
                    className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all duration-200 px-3 py-1.5"
                  >
                    In Progress
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all duration-200 px-3 py-1.5"
                  >
                    Completed
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <EmptyState />
              ) : (
                <TaskList
                  tasks={filteredTasks}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <footer className="text-center mt-4 mb-2">
          <p className="text-sm text-gray-500">
            © 2025 Intouch Charoenphon. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
