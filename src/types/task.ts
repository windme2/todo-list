export interface Task {
  id: string;
  text: string;
  detail?: string;
  completed: boolean;
  createdAt: Date;
  priority: "low" | "medium" | "high";
}
