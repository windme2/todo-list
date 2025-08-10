import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import { Task } from "@/types/task";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
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
  };

  const filteredTasks = tasks.filter((task) => {
    return (
      filter === "all" ||
      (filter === "active" && !task.completed) ||
      (filter === "completed" && task.completed)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 px-4 pt-24 pb-4 transition-all duration-500 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto">
        {/* Main Card Container */}
        <Card className="shadow-2xl border-none bg-white/98 backdrop-blur-xl transition-all duration-300 hover:shadow-3xl rounded-2xl overflow-hidden animate-fade-in">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
              {/* Left Section - Add Task Form */}
              <div className="p-8 lg:p-10 relative bg-white flex flex-col">
                {/* Header centered and prominent */}
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
                    Todo List
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Manage your tasks efficiently and stay organized
                  </p>
                </div>
                
                <div className="flex-1 flex items-start justify-center">
                  <div className="w-full bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50">
                    <TaskInput onAddTask={handleAddTask} />
                  </div>
                </div>

                {/* Enhanced Divider with stronger shadow */}
                <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-gray-400 to-transparent shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-300/50 to-transparent blur-sm"></div>
                </div>
              </div>

              {/* Right Section - Task List */}
              <div className="p-8 lg:p-10 bg-white">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Filter className="h-6 w-6 text-indigo-600" />
                    <h2 className="text-2xl font-bold text-gray-800">
                      Tasks Overview
                    </h2>
                  </div>

                  <Tabs
                    defaultValue="all"
                    value={filter}
                    onValueChange={(value) => setFilter(value as FilterType)}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3 bg-gray-50 p-1 rounded-xl gap-0 border-0 h-12">
                      <TabsTrigger
                        value="all"
                        className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm data-[state=active]:font-semibold transition-all duration-200 h-10 rounded-lg font-medium text-gray-600 hover:text-gray-800"
                      >
                        All Tasks
                      </TabsTrigger>
                      <TabsTrigger
                        value="active"
                        className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm data-[state=active]:font-semibold transition-all duration-200 h-10 rounded-lg font-medium text-gray-600 hover:text-gray-800"
                      >
                        In Progress
                      </TabsTrigger>
                      <TabsTrigger
                        value="completed"
                        className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm data-[state=active]:font-semibold transition-all duration-200 h-10 rounded-lg font-medium text-gray-600 hover:text-gray-800"
                      >
                        Completed
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                    {filteredTasks.length === 0 ? (
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-gray-200/50 shadow-sm">
                        <EmptyState />
                      </div>
                    ) : (
                      <TaskList
                        tasks={filteredTasks}
                        onToggleComplete={handleToggleComplete}
                        onDelete={handleDeleteTask}
                        onEdit={handleEditTask}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <footer className="text-center mt-8">
          <p className="text-sm text-white/90 font-medium">
            © 2025 Intouch Charoenphon. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
