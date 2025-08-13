import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

interface TaskInputProps {
  onAddTask: (
    text: string,
    detail: string,
    priority: "low" | "medium" | "high"
  ) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [text, setText] = useState("");
  const [detail, setDetail] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTask(text, detail, priority);
      setText("");
      setDetail("");
      setPriority("medium");
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (hasError && e.target.value.trim()) {
      setHasError(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        type="text"
        value={text}
        onChange={handleTextChange}
        placeholder="Enter your task here..."
        className={`w-full ${hasError ? 'border-red-500 border-2' : ''}`}
      />
      <Textarea
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        placeholder="Add more details about your task (optional)"
        className="w-full min-h-[200px] resize-none"
      />
      <div className="space-y-3">
        <Label>Priority</Label>
        <RadioGroup
          value={priority}
          onValueChange={(value: string) =>
            setPriority(value as "low" | "medium" | "high")
          }
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="low" />
            <Label htmlFor="low" className="text-green-600 font-medium">
              Low
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium" className="text-yellow-600 font-medium">
              Medium
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="high" />
            <Label htmlFor="high" className="text-red-600 font-medium">
              High
            </Label>
          </div>
        </RadioGroup>
      </div>
      <Button type="submit" className="w-full mt-2">
        Add Task
      </Button>
    </form>
  );
};

export default TaskInput;
