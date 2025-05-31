
import { useState, useEffect } from "react";
import { fetchBudgets } from "@/lib/api"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseTracker } from "@/components/ExpenseTracker";
import { IncomeTracker } from "@/components/IncomeTracker";
import { BudgetSummary } from "@/components/BudgetSummary";
import { GoalTracker } from "@/components/GoalTracker";
import { SpendingInsights } from "@/components/SpendingInsights";
import { BillTracker } from "@/components/BillTracker";

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
}

export interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  isPaid: boolean;
}

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "1", name: "Phone Bill", amount: 50, category: "Bills", date: "2024-05-01" },
    { id: "2", name: "Gas", amount: 120, category: "Transportation", date: "2024-05-02" },
    { id: "3", name: "Groceries", amount: 200, category: "Food", date: "2024-05-03" },
  ]);

  const [income, setIncome] = useState<Income[]>([
    { id: "1", source: "Week 1 Salary", amount: 500, date: "2024-05-01" },
    { id: "2", source: "Week 2 Salary", amount: 500, date: "2024-05-08" },
    { id: "3", source: "Freelance", amount: 300, date: "2024-05-15" },
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    { id: "1", name: "Emergency Fund", targetAmount: 2000, currentAmount: 1200, targetDate: "2024-08-01" },
    { id: "2", name: "Vacation", targetAmount: 1500, currentAmount: 600, targetDate: "2024-12-01" },
  ]);

  const [bills, setBills] = useState<Bill[]>([
    { id: "1", name: "Rent", amount: 800, dueDate: "2024-06-01", category: "Housing", isPaid: false },
    { id: "2", name: "Electric Bill", amount: 85, dueDate: "2024-06-05", category: "Utilities", isPaid: true },
  ]);

  useEffect(() => {
    fetchBudgets().then(data => {
      console.log("Fetched budgets from API:", data);
    }).catch(err => {
      console.error("API error:", err);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Personal Budget Manager
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Take control of your finances with smart budgeting, goal tracking, and spending insights
          </p>
        </div>

        {/* Budget Summary */}
        <BudgetSummary expenses={expenses} income={income} />

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-max mx-auto">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="expenses" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Expenses
            </TabsTrigger>
            <TabsTrigger value="income" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Income
            </TabsTrigger>
            <TabsTrigger value="goals" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Goals
            </TabsTrigger>
            <TabsTrigger value="bills" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Bills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SpendingInsights expenses={expenses} income={income} />
              <GoalTracker goals={goals} setGoals={setGoals} />
            </div>
          </TabsContent>

          <TabsContent value="expenses">
            <ExpenseTracker expenses={expenses} setExpenses={setExpenses} />
          </TabsContent>

          <TabsContent value="income">
            <IncomeTracker income={income} setIncome={setIncome} />
          </TabsContent>

          <TabsContent value="goals">
            <GoalTracker goals={goals} setGoals={setGoals} />
          </TabsContent>

          <TabsContent value="bills">
            <BillTracker bills={bills} setBills={setBills} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
