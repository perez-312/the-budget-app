
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { Expense } from "@/pages/Index";

interface ExpenseTrackerProps {
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
}

const categories = ["Food", "Transportation", "Bills", "Entertainment", "Healthcare", "Shopping", "Other"];

export const ExpenseTracker = ({ expenses, setExpenses }: ExpenseTrackerProps) => {
  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const addExpense = async () => {
    if (newExpense.name && newExpense.amount && newExpense.category) {
      const expense: Expense = {
        id: Date.now().toString(),
        name: newExpense.name,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date,
      };

      try {
        await fetch("https://93eogce5if.execute-api.us-east-1.amazonaws.com/dev/budget", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expense),
        });
      } catch (error) {
        console.error("Failed to save expense to backend:", error);
      }

      setExpenses([...expenses, expense]);
      setNewExpense({ name: "", amount: "", category: "", date: new Date().toISOString().split('T')[0] });
    }
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const editExpense = (expense: Expense) => {
    setEditingId(expense.id);
    setNewExpense({
      name: expense.name,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
    });
  };

  const updateExpense = () => {
    if (editingId) {
      setExpenses(
        expenses.map((expense) =>
          expense.id === editingId
            ? {
                ...expense,
                name: newExpense.name,
                amount: parseFloat(newExpense.amount),
                category: newExpense.category,
                date: newExpense.date,
              }
            : expense
        )
      );
      setEditingId(null);
      setNewExpense({ name: "", amount: "", category: "", date: new Date().toISOString().split('T')[0] });
    }
  };

  const totalByCategory = categories.map((category) => ({
    category,
    total: expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0),
  })).filter((item) => item.total > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Add/Edit Expense Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-blue-500" />
            {editingId ? "Edit Expense" : "Add New Expense"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="expense-name">Expense Name</Label>
            <Input
              id="expense-name"
              value={newExpense.name}
              onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
              placeholder="e.g., Phone Bill"
            />
          </div>
          <div>
            <Label htmlFor="expense-amount">Amount</Label>
            <Input
              id="expense-amount"
              type="number"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="expense-category">Category</Label>
            <Select value={newExpense.category} onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="expense-date">Date</Label>
            <Input
              id="expense-date"
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            />
          </div>
          <Button 
            onClick={editingId ? updateExpense : addExpense} 
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            {editingId ? "Update Expense" : "Add Expense"}
          </Button>
          {editingId && (
            <Button 
              onClick={() => {
                setEditingId(null);
                setNewExpense({ name: "", amount: "", category: "", date: new Date().toISOString().split('T')[0] });
              }}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Expense List */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium">{expense.name}</p>
                  <p className="text-sm text-slate-600">
                    {expense.category} • {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-red-600">${expense.amount}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => editExpense(expense)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteExpense(expense.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Summary */}
      {totalByCategory.length > 0 && (
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {totalByCategory.map((item) => (
                <div key={item.category} className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg">
                  <p className="text-sm font-medium text-slate-600">{item.category}</p>
                  <p className="text-xl font-bold text-slate-900">${item.total}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
