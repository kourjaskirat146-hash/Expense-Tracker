import unittest
from app import app, expenses

class ExpenseTrackerTest(unittest.TestCase):
    def setUp(self):
        # Create a test client
        self.app = app.test_client()
        self.app.testing = True
        # Clear expenses before each test
        expenses.clear()

    def test_main_route(self):
        """Test the main dashboard loads."""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)

    def test_add_expense(self):
        """Test adding an expense via POST."""
        data = {
            'description': 'Lunch',
            'amount': '15.50',
            'category': 'Food'
        }
        response = self.app.post('/add', data=data, follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(expenses), 1)
        self.assertEqual(expenses[0]['description'], 'Lunch')

    def test_delete_expense(self):
        """Test deleting an expense."""
        # Add one first
        expenses.append({
            'id': 'test-id',
            'description': 'Coffee',
            'amount': 5.0,
            'category': 'Food',
            'date': '2023-01-01'
        })
        self.assertEqual(len(expenses), 1)
        
        response = self.app.get('/delete/test-id', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(expenses), 0)

    def test_summary_api(self):
        """Test the summary JSON endpoint."""
        expenses.append({'id': '1', 'amount': 10.0, 'category': 'Food'})
        expenses.append({'id': '2', 'amount': 20.0, 'category': 'Food'})
        expenses.append({'id': '3', 'amount': 100.0, 'category': 'Housing'})
        
        response = self.app.get('/summary')
        data = response.get_json()
        
        self.assertEqual(data['total'], 130.0)
        self.assertEqual(data['by_category']['Food'], 30.0)
        self.assertEqual(data['by_category']['Housing'], 100.0)

if __name__ == '__main__':
    unittest.main()
