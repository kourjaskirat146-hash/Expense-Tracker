from flask import Flask, render_template, request, jsonify, redirect, url_for
import uuid
from datetime import datetime

app = Flask(__name__)

# In-memory storage: List of dictionaries
# Each expense: {'id': str, 'amount': float, 'category': str, 'description': str, 'date': str}
expenses = []

@app.route('/')
def index():
    """Main dashboard showing all expenses and summary."""
    total_spent = sum(e['amount'] for e in expenses)
    
    # Group by category
    category_summary = {}
    for e in expenses:
        cat = e['category']
        category_summary[cat] = category_summary.get(cat, 0) + e['amount']
        
    return render_template('index.html', expenses=expenses, total=total_spent, summary=category_summary)

@app.route('/add', methods=['POST'])
def add_expense():
    """Add a new expense to the list."""
    description = request.form.get('description')
    amount = request.form.get('amount')
    category = request.form.get('category')

    if description and amount and category:
        new_expense = {
            'id': str(uuid.uuid4()),
            'description': description,
            'amount': float(amount),
            'category': category,
            'date': datetime.now().strftime('%Y-%m-%d')
        }
        expenses.append(new_expense)
    
    return redirect(url_for('index'))

@app.route('/delete/<string:expense_id>')
def delete_expense(expense_id):
    """Delete an expense by its ID."""
    global expenses
    expenses = [e for e in expenses if e['id'] != expense_id]
    return redirect(url_for('index'))

@app.route('/summary')
def summary():
    """API endpoint for summary data."""
    total_spent = sum(e['amount'] for e in expenses)
    category_summary = {}
    for e in expenses:
        cat = e['category']
        category_summary[cat] = category_summary.get(cat, 0) + e['amount']
        
    return jsonify({
        'total': total_spent,
        'by_category': category_summary
    })

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 3000))
    # AI Studio sandbox uses port 3000
    app.run(host='0.0.0.0', port=port, debug=True)
