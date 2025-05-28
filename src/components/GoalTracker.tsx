
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Target, Trash2, Edit, DollarSign } from "lucide-react";
import { Goal } from "@/pages/Index";

interface GoalTrackerProps {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
}

export const GoalTracker = ({ goals, setGoals }: GoalTrackerProps) => {
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    targetDate: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const addGoal = () => {
    if (newGoal.name && newGoal.targetAmount && newGoal.targetDate) {
      const goal: Goal = {
        id: Date.now().toString(),
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: parseFloat(newGoal.currentAmount) || 0,
        targetDate: newGoal.targetDate,
      };
      setGoals([...goals, goal]);
      setNewGoal({ name: "", targetAmount: "", currentAmount: "", targetDate: "" });
    }
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  const editGoal = (goal: Goal) => {
    setEditingId(goal.id);
    setNewGoal({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      targetDate: goal.targetDate,
    });
  };

  const updateGoal = () => {
    if (editingId) {
      setGoals(
        goals.map((goal) =>
          goal.id === editingId
            ? {
                ...goal,
                name: newGoal.name,
                targetAmount: parseFloat(newGoal.targetAmount),
                currentAmount: parseFloat(newGoal.currentAmount) || 0,
                targetDate: newGoal.targetDate,
              }
            : goal
        )
      );
      setEditingId(null);
      setNewGoal({ name: "", targetAmount: "", currentAmount: "", targetDate: "" });
    }
  };

  const updateGoalProgress = (id: string, amount: number) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id
          ? { ...goal, currentAmount: Math.min(goal.targetAmount, Math.max(0, amount)) }
          : goal
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Goal Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            {editingId ? "Edit Goal" : "Set New Goal"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="goal-name">Goal Name</Label>
              <Input
                id="goal-name"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                placeholder="e.g., Emergency Fund"
              />
            </div>
            <div>
              <Label htmlFor="goal-target">Target Amount</Label>
              <Input
                id="goal-target"
                type="number"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="goal-current">Current Amount</Label>
              <Input
                id="goal-current"
                type="number"
                value={newGoal.currentAmount}
                onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="goal-date">Target Date</Label>
              <Input
                id="goal-date"
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
              />
            </div>
          </div>
          <Button 
            onClick={editingId ? updateGoal : addGoal} 
            className="w-full bg-purple-500 hover:bg-purple-600"
          >
            {editingId ? "Update Goal" : "Add Goal"}
          </Button>
          {editingId && (
            <Button 
              onClick={() => {
                setEditingId(null);
                setNewGoal({ name: "", targetAmount: "", currentAmount: "", targetDate: "" });
              }}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Goals List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <Card key={goal.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{goal.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => editGoal(goal)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteGoal(goal.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>${goal.currentAmount.toLocaleString()}</span>
                    <span>${goal.targetAmount.toLocaleString()}</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>{progress.toFixed(1)}% complete</span>
                    <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Add amount"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        const amount = parseFloat(input.value);
                        if (amount) {
                          updateGoalProgress(goal.id, goal.currentAmount + amount);
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                      const amount = parseFloat(input.value);
                      if (amount) {
                        updateGoalProgress(goal.id, goal.currentAmount + amount);
                        input.value = '';
                      }
                    }}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <DollarSign className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
