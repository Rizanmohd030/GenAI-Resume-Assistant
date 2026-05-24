import express from 'express';
import cors from 'cors';
import handler from './api/generate.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  // Wrap req and res to mimic VercelRequest and VercelResponse
  const vercelReq = {
    method: req.method,
    body: req.body,
    headers: req.headers,
  };
  
  const vercelRes = {
    status: (statusCode) => {
      res.status(statusCode);
      return vercelRes;
    },
    json: (data) => {
      res.json(data);
    }
  };

  try {
    await handler(vercelReq as any, vercelRes as any);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Local API server running on port ${PORT}`);
});
