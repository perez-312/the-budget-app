
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Edit, TrendingUp } from "lucide-react";
import { Income } from "@/pages/Index";

interface IncomeTrackerProps {
  income: Income[];
  setIncome: (income: Income[]) => void;
}

export const IncomeTracker = ({ income, setIncome }: IncomeTrackerProps) => {
  const [newIncome, setNewIncome] = useState({
    source: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const addIncome = () => {
    if (newIncome.source && newIncome.amount) {
      const incomeEntry: Income = {
        id: Date.now().toString(),
        source: newIncome.source,
        amount: parseFloat(newIncome.amount),
        date: newIncome.date,
      };
      setIncome([...income, incomeEntry]);
      setNewIncome({ source: "", amount: "", date: new Date().toISOString().split('T')[0] });
    }
  };

  const deleteIncome = (id: string) => {
    setIncome(income.filter((inc) => inc.id !== id));
  };

  const editIncome = (incomeEntry: Income) => {
    setEditingId(incomeEntry.id);
    setNewIncome({
      source: incomeEntry.source,
      amount: incomeEntry.amount.toString(),
      date: incomeEntry.date,
    });
  };

  const updateIncome = () => {
    if (editingId) {
      setIncome(
        income.map((inc) =>
          inc.id === editingId
            ? {
                ...inc,
                source: newIncome.source,
                amount: parseFloat(newIncome.amount),
                date: newIncome.date,
              }
            : inc
        )
      );
      setEditingId(null);
      setNewIncome({ source: "", amount: "", date: new Date().toISOString().split('T')[0] });
    }
  };

  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Add/Edit Income Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-green-500" />
            {editingId ? "Edit Income" : "Add New Income"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="income-source">Income Source</Label>
            <Input
              id="income-source"
              value={newIncome.source}
              onChange={(e) => setNewIncome({ ...newIncome, source: e.target.value })}
              placeholder="e.g., Salary, Freelance, Investment"
            />
          </div>
          <div>
            <Label htmlFor="income-amount">Amount</Label>
            <Input
              id="income-amount"
              type="number"
              value={newIncome.amount}
              onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="income-date">Date</Label>
            <Input
              id="income-date"
              type="date"
              value={newIncome.date}
              onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
            />
          </div>
          <Button 
            onClick={editingId ? updateIncome : addIncome} 
            className="w-full bg-green-500 hover:bg-green-600"
          >
            {editingId ? "Update Income" : "Add Income"}
          </Button>
          {editingId && (
            <Button 
              onClick={() => {
                setEditingId(null);
                setNewIncome({ source: "", amount: "", date: new Date().toISOString().split('T')[0] });
              }}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Income List */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Income Entries</span>
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-lg font-bold">${totalIncome.toLocaleString()}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {income.map((incomeEntry) => (
              <div
                key={incomeEntry.id}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium">{incomeEntry.source}</p>
                  <p className="text-sm text-slate-600">
                    {new Date(incomeEntry.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-green-600">${incomeEntry.amount}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => editIncome(incomeEntry)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteIncome(incomeEntry.id)}
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
    </div>
  );
};
