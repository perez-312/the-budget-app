
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle, CheckCircle, PlusCircle, Trash2, Edit } from "lucide-react";
import { Bill } from "@/pages/Index";

interface BillTrackerProps {
  bills: Bill[];
  setBills: (bills: Bill[]) => void;
}

const categories = ["Housing", "Utilities", "Insurance", "Subscriptions", "Loans", "Other"];

export const BillTracker = ({ bills, setBills }: BillTrackerProps) => {
  const [newBill, setNewBill] = useState({
    name: "",
    amount: "",
    dueDate: "",
    category: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const addBill = () => {
    if (newBill.name && newBill.amount && newBill.dueDate && newBill.category) {
      const bill: Bill = {
        id: Date.now().toString(),
        name: newBill.name,
        amount: parseFloat(newBill.amount),
        dueDate: newBill.dueDate,
        category: newBill.category,
        isPaid: false,
      };
      setBills([...bills, bill]);
      setNewBill({ name: "", amount: "", dueDate: "", category: "" });
    }
  };

  const deleteBill = (id: string) => {
    setBills(bills.filter((bill) => bill.id !== id));
  };

  const togglePaid = (id: string) => {
    setBills(bills.map((bill) => 
      bill.id === id ? { ...bill, isPaid: !bill.isPaid } : bill
    ));
  };

  const editBill = (bill: Bill) => {
    setEditingId(bill.id);
    setNewBill({
      name: bill.name,
      amount: bill.amount.toString(),
      dueDate: bill.dueDate,
      category: bill.category,
    });
  };

  const updateBill = () => {
    if (editingId) {
      setBills(
        bills.map((bill) =>
          bill.id === editingId
            ? {
                ...bill,
                name: newBill.name,
                amount: parseFloat(newBill.amount),
                dueDate: newBill.dueDate,
                category: newBill.category,
              }
            : bill
        )
      );
      setEditingId(null);
      setNewBill({ name: "", amount: "", dueDate: "", category: "" });
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const upcomingBills = bills
    .filter(bill => !bill.isPaid)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const totalUpcoming = upcomingBills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Add/Edit Bill Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-500" />
            {editingId ? "Edit Bill" : "Add New Bill"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="bill-name">Bill Name</Label>
            <Input
              id="bill-name"
              value={newBill.name}
              onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
              placeholder="e.g., Rent, Electric Bill"
            />
          </div>
          <div>
            <Label htmlFor="bill-amount">Amount</Label>
            <Input
              id="bill-amount"
              type="number"
              value={newBill.amount}
              onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="bill-category">Category</Label>
            <Select value={newBill.category} onValueChange={(value) => setNewBill({ ...newBill, category: value })}>
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
            <Label htmlFor="bill-date">Due Date</Label>
            <Input
              id="bill-date"
              type="date"
              value={newBill.dueDate}
              onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })}
            />
          </div>
          <Button 
            onClick={editingId ? updateBill : addBill} 
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            {editingId ? "Update Bill" : "Add Bill"}
          </Button>
          {editingId && (
            <Button 
              onClick={() => {
                setEditingId(null);
                setNewBill({ name: "", amount: "", dueDate: "", category: "" });
              }}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Bills Summary */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Upcoming Bills</span>
            <Badge variant="outline" className="text-lg font-bold">
              ${totalUpcoming.toLocaleString()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {upcomingBills.map((bill) => {
              const daysUntilDue = getDaysUntilDue(bill.dueDate);
              const isOverdue = daysUntilDue < 0;
              const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 3;
              
              return (
                <div
                  key={bill.id}
                  className={`p-3 rounded-lg border ${
                    isOverdue ? 'bg-red-50 border-red-200' : 
                    isDueSoon ? 'bg-yellow-50 border-yellow-200' : 
                    'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={bill.isPaid}
                        onCheckedChange={() => togglePaid(bill.id)}
                      />
                      <div>
                        <p className="font-medium">{bill.name}</p>
                        <p className="text-sm text-slate-600">
                          {bill.category} • Due {new Date(bill.dueDate).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {isOverdue ? (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Overdue
                            </Badge>
                          ) : isDueSoon ? (
                            <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-600">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Due Soon
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              {daysUntilDue} days
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${bill.amount}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editBill(bill)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteBill(bill.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* All Bills List */}
      <Card className="shadow-lg lg:col-span-2">
        <CardHeader>
          <CardTitle>All Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bills.map((bill) => (
              <div
                key={bill.id}
                className={`p-4 rounded-lg border ${
                  bill.isPaid ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{bill.name}</h4>
                  {bill.isPaid ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-1">{bill.category}</p>
                <p className="font-semibold text-lg">${bill.amount}</p>
                <p className="text-sm text-slate-600">
                  Due: {new Date(bill.dueDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
