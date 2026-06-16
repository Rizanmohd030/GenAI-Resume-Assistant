import express from 'express';
import cors from 'cors';
import handler from './api/generate.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/generate', async (req, res) => {
  // Wrap req and res to mimic VercelRequest and VercelResponse
  const vercelReq = {
    method: req.method,
    body: req.body,
    headers: req.headers,
  };
  
  const vercelRes = {
    status: (statusCode: number) => {
      res.status(statusCode);
      return vercelRes;
    },
    json: (data: unknown) => {
      res.json(data);
    }
  };

  try {
    await handler(vercelReq as any, vercelRes as any);
  } catch (error: unknown) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

import generateResumeHandler from './api/generateResume.js';
app.post('/api/generate-resume', async (req, res) => {
  const vercelReq = { method: req.method, body: req.body, headers: req.headers };
  const vercelRes = {
    status: (statusCode: number) => { res.status(statusCode); return vercelRes; },
    json: (data: unknown) => { res.json(data); }
  };
  try {
    await generateResumeHandler(vercelReq as any, vercelRes as any);
  } catch (error: unknown) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

const PORT = 3001;
const HOST = '0.0.0.0';
const server = app.listen(PORT, HOST, () => {
  console.log(`Local API server running on http://${HOST}:${PORT}`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please close the other process or change the port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});
