
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { DollarSign, TrendingUp, Wallet, Target } from "lucide-react";
import { Expense, Income } from "@/pages/Index";

interface BudgetSummaryProps {
  expenses: Expense[];
  income: Income[];
}

export const BudgetSummary = ({ expenses, income }: BudgetSummaryProps) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
  const savings = totalIncome - totalExpenses;

  const pieData = [
    { name: "Expenses", value: totalExpenses, color: "#ef4444" },
    { name: "Savings", value: Math.max(0, savings), color: "#22c55e" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Summary Cards */}
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <TrendingUp className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalIncome.toLocaleString()}</div>
          <p className="text-blue-100 text-xs">This month</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <Wallet className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
          <p className="text-red-100 text-xs">This month</p>
        </CardContent>
      </Card>

      <Card className={`bg-gradient-to-br ${savings >= 0 ? 'from-green-500 to-green-600' : 'from-orange-500 to-orange-600'} text-white border-0 shadow-lg hover:shadow-xl transition-shadow`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
          <Target className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${savings.toLocaleString()}</div>
          <p className={`text-xs ${savings >= 0 ? 'text-green-100' : 'text-orange-100'}`}>
            {savings >= 0 ? 'Surplus' : 'Deficit'}
          </p>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="text-center text-lg">Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
