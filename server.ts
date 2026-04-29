import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { expenseManager } from './src/expenseLogic.js';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Middleware
  app.use(express.json());

  /**
   * API: Get all expenses
   */
  app.get('/api/expenses', (req, res) => {
    res.json(expenseManager.getExpenses());
  });

  /**
   * API: Add expense (POST)
   */
  app.post('/api/expenses', (req, res) => {
    const { amount, category, description } = req.body;
    
    if (!amount || !category || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newExpense = expenseManager.addExpense(parseFloat(amount), category, description);
    res.status(201).json(newExpense);
  });

  /**
   * API: Delete expense
   */
  app.delete('/api/expenses/:id', (req, res) => {
    const { id } = req.params;
    expenseManager.deleteExpense(id);
    res.status(204).send();
  });

  /**
   * API: Summary
   */
  app.get('/api/summary', (req, res) => {
    res.json(expenseManager.getSummary());
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
