import { describe, it, expect, beforeEach } from 'vitest';
import { ExpenseManager } from '../src/expenseLogic';

describe('ExpenseManager', () => {
  let manager: ExpenseManager;

  beforeEach(() => {
    manager = new ExpenseManager();
  });

  it('should start with an empty list of expenses', () => {
    expect(manager.getExpenses()).toEqual([]);
  });

  it('should add an expense correctly', () => {
    const expense = manager.addExpense(50, 'Food', 'Pizza');
    expect(manager.getExpenses().length).toBe(1);
    expect(expense.amount).toBe(50);
    expect(expense.category).toBe('Food');
    expect(expense.description).toBe('Pizza');
  });

  it('should delete an expense correctly', () => {
    const expense = manager.addExpense(20, 'Transport', 'Bus');
    const id = expense.id;
    expect(manager.getExpenses().length).toBe(1);
    
    const deleted = manager.deleteExpense(id);
    expect(deleted).toBe(true);
    expect(manager.getExpenses().length).toBe(0);
  });

  it('should calculate summary correctly', () => {
    manager.addExpense(10, 'Food', 'Coffee');
    manager.addExpense(50, 'Food', 'Dinner');
    manager.addExpense(100, 'Housing', 'Rent');
    
    const summary = manager.getSummary();
    expect(summary.total).toBe("160.00");
    expect(summary.byCategory['Food']).toBe(60);
    expect(summary.byCategory['Housing']).toBe(100);
  });

  it('should not delete non-existent expense', () => {
    const deleted = manager.deleteExpense('non-existent-id');
    expect(deleted).toBe(false);
  });
});
