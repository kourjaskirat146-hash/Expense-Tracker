/**
 * Expense Tracker Frontend Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expensesBody = document.getElementById('expenses-body');
    const totalSpentEl = document.getElementById('total-spent');
    const categorySummaryEl = document.getElementById('category-summary');

    // Initial Load
    fetchExpenses();
    fetchSummary();

    // Handle Form Submission
    expenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(expenseForm);
        const data = {
            description: formData.get('description'),
            amount: formData.get('amount'),
            category: formData.get('category')
        };

        try {
            const response = await fetch('/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                expenseForm.reset();
                fetchExpenses();
                fetchSummary();
            } else {
                alert('Failed to add expense');
            }
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    });

    /**
     * Fetch and Display Expenses
     */
    async function fetchExpenses() {
        try {
            const response = await fetch('/api/expenses');
            const expenses = await response.json();
            renderExpenses(expenses);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    }

    /**
     * Fetch and Display Summary
     */
    async function fetchSummary() {
        try {
            const response = await fetch('/api/summary');
            const summary = await response.json();
            
            totalSpentEl.textContent = `$${summary.total}`;
            
            categorySummaryEl.innerHTML = '';
            for (const [category, amount] of Object.entries(summary.byCategory)) {
                const tag = document.createElement('span');
                tag.className = 'category-tag';
                tag.textContent = `${category}: $${parseFloat(amount).toFixed(2)}`;
                categorySummaryEl.appendChild(tag);
            }
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
    }

    /**
     * Render Expenses Table
     */
    function renderExpenses(expenses) {
        expensesBody.innerHTML = '';
        
        // Sort by date (newest first)
        expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        expenses.forEach(expense => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${expense.date}</td>
                <td>${expense.description}</td>
                <td><span class="category-tag">${expense.category}</span></td>
                <td class="amount-val">$${parseFloat(expense.amount).toFixed(2)}</td>
                <td>
                    <button class="btn-delete" data-id="${expense.id}">Delete</button>
                </td>
            `;
            expensesBody.appendChild(tr);
        });

        // Add Delete Listeners
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => deleteExpense(btn.dataset.id));
        });
    }

    /**
     * Delete Expense
     */
    async function deleteExpense(id) {
        try {
            const response = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchExpenses();
                fetchSummary();
            } else {
                alert('Failed to delete expense');
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    }
});
