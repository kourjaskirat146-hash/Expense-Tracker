export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export class ExpenseManager {
  private expenses: Expense[] = [];

  constructor() {}

  getExpenses(): Expense[] {
    return this.expenses;
  }

  addExpense(amount: number, category: string, description: string): Expense {
    const newExpense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      amount,
      category,
      description,
      date: new Date().toISOString().split('T')[0]
    };
    this.expenses.push(newExpense);
    return newExpense;
  }

  deleteExpense(id: string): boolean {
    const initialLength = this.expenses.length;
    this.expenses = this.expenses.filter(e => e.id !== id);
    return this.expenses.length < initialLength;
  }

  getSummary() {
    const total = this.expenses.reduce((sum, e) => sum + e.amount, 0);
    const byCategory = this.expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: total.toFixed(2),
      byCategory
    };
  }

  clear() {
    this.expenses = [];
  }
}

export const expenseManager = new ExpenseManager();
