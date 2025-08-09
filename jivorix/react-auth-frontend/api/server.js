/*import express from 'express';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const CODEBASE_DIR = path.resolve('../src/pages/admin');

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const mistralApiKey = process.env.MISTRAL_API_KEY;
if (!mistralApiKey) {
  console.error('❌ MISTRAL_API_KEY is not set in .env');
  process.exit(1);
}

async function readCodeFile(filePath) {
  try {
    const fullPath = path.join(CODEBASE_DIR, filePath);
    console.log(`Reading file: ${fullPath}`);
    if (!fullPath.startsWith(CODEBASE_DIR)) {
      throw new Error('Access denied: File path is outside codebase directory.');
    }
    if (!await fs.pathExists(fullPath)) {
      throw new Error(`File ${filePath} does not exist.`);
    }
    const content = await fs.readFile(fullPath, 'utf-8');
    return content;
  } catch (err) {
    throw new Error(`Failed to read file ${filePath}: ${err.message}`);
  }
}

async function writeCodeFile(filePath, content) {
  try {
    const fullPath = path.join(CODEBASE_DIR, filePath);
    console.log(`Writing to file: ${fullPath}`);
    if (!fullPath.startsWith(CODEBASE_DIR)) {
      throw new Error('Access denied: File path is outside codebase directory.');
    }
    await fs.writeFile(fullPath, content, 'utf-8');
    return true;
  } catch (err) {
    throw new Error(`Failed to write to file ${filePath}: ${err.message}`);
  }
}

async function backupCodeFile(filePath) {
  try {
    const backupDir = path.join(CODEBASE_DIR, 'backups');
    const backupPath = path.join(backupDir, `${path.basename(filePath)}.backup-${Date.now()}`);
    console.log(`Backing up to: ${backupPath}`);
    await fs.ensureDir(backupDir);
    await fs.copyFile(path.join(CODEBASE_DIR, filePath), backupPath);
  } catch (err) {
    console.error(`Failed to create backup for ${filePath}: ${err.message}`);
  }
}

app.get('/list-files', async (req, res) => {
  try {
    console.log(`Listing files in: ${CODEBASE_DIR}`);
    const files = await fs.readdir(CODEBASE_DIR);
    const codeFiles = files.filter((file) => file.match(/\.(js|jsx|ts|tsx)$/));
    console.log('Files found:', codeFiles);
    res.json({ success: true, files: codeFiles });
  } catch (err) {
    console.error('❌ List files error:', err.message, err.stack);
    res.status(500).json({ success: false, error: 'Failed to list files.', details: err.message });
  }
});

app.post('/modify-code', async (req, res) => {
  const { filePath, instruction } = req.body;

  console.log(`Modify request: filePath=${filePath}, instruction=${instruction}`);

  if (!filePath || !instruction) {
    return res.status(400).json({ success: false, error: 'filePath and instruction are required.' });
  }

  if (filePath.includes('..') || !filePath.match(/\.(js|jsx|ts|tsx)$/)) {
    return res.status(400).json({ success: false, error: 'Invalid file path. Only .js, .jsx, .ts, .tsx files are allowed.' });
  }

  if (instruction.length > 1000) {
    return res.status(400).json({ success: false, error: 'Instruction too long (max 1000 characters).' });
  }

  try {
    const originalCode = await readCodeFile(filePath);
    console.log(`Original code length: ${originalCode.length} chars`);
    await backupCodeFile(filePath);

    console.log('Calling Mistral API...');
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'codestral-latest',
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant named Ilamely Kanxo, created by Sandesh Ghimire. Modify the provided code according to the user's instruction. Return only the modified code as a string, without explanations or markdown. Ensure the code is syntactically correct and respects the original structure unless instructed otherwise.`,
          },
          {
            role: 'user',
            content: `File: ${filePath}\n\nCurrent code:\n${originalCode}\n\nInstruction: ${instruction}`,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${mistralApiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    ).catch(err => {
      throw new Error(`Mistral API request failed: ${err.response?.status} ${err.response?.data?.error || err.message}`);
    });

    const modifiedCode = response.data.choices[0].message.content;
    console.log(`Modified code length: ${modifiedCode.length} chars`);
    await writeCodeFile(filePath, modifiedCode);

    res.json({
      success: true,
      message: `File ${filePath} modified successfully.`,
      modifiedCode,
    });
  } catch (err) {
    console.error('❌ Code modification error:', err.message, err.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to modify code.',
      details: err.message,
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Ilamely Kanxo AI Server running at http://localhost:${PORT}`);
});*/












import express from 'express';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const CODEBASE_DIR = path.resolve('../src/pages/admin/orderDetail');


app.use(cors({ origin: '*' }));
app.use(express.json());

const mistralApiKey = process.env.MISTRAL_API_KEY;
if (!mistralApiKey) {
  console.error('❌ MISTRAL_API_KEY is not set in .env');
  process.exit(1);
}

async function readCodeFile(filePath) {
  try {
    const fullPath = path.join(CODEBASE_DIR, filePath);
    console.log(`Reading file: ${fullPath}`);
    if (!fullPath.startsWith(CODEBASE_DIR)) {
      throw new Error('Access denied: File path is outside codebase directory.');
    }
    if (!await fs.pathExists(fullPath)) {
      throw new Error(`File ${filePath} does not exist.`);
    }
    const content = await fs.readFile(fullPath, 'utf-8');
    return content;
  } catch (err) {
    throw new Error(`Failed to read file ${filePath}: ${err.message}`);
  }
}

async function writeCodeFile(filePath, content) {
  try {
    const fullPath = path.join(CODEBASE_DIR, filePath);
    console.log(`Writing to file: ${fullPath}`);
    if (!fullPath.startsWith(CODEBASE_DIR)) {
      throw new Error('Access denied: File path is outside codebase directory.');
    }
    await fs.writeFile(fullPath, content, 'utf-8');
    return true;
  } catch (err) {
    throw new Error(`Failed to write to file ${filePath}: ${err.message}`);
  }
}

async function backupCodeFile(filePath) {
  try {
    const backupDir = path.join(CODEBASE_DIR, 'backups');
    const backupPath = path.join(backupDir, `${path.basename(filePath)}.backup-${Date.now()}`);
    console.log(`Backing up to: ${backupPath}`);
    await fs.ensureDir(backupDir);
    await fs.copyFile(path.join(CODEBASE_DIR, filePath), backupPath);
  } catch (err) {
    console.error(`Failed to create backup for ${filePath}: ${err.message}`);
  }
}

app.get('/list-files', async (req, res) => {
  try {
    console.log(`Listing files in: ${CODEBASE_DIR}`);
    const files = await fs.readdir(CODEBASE_DIR);
    const codeFiles = files.filter((file) => file.match(/\.(js|jsx|ts|tsx)$/));
    console.log('Files found:', codeFiles);
    res.json({ success: true, files: codeFiles });
  } catch (err) {
    console.error('❌ List files error:', err.message, err.stack);
    res.status(500).json({ success: false, error: 'Failed to list files.', details: err.message });
  }
});

app.post('/modify-code', async (req, res) => {
  const { filePath, instruction } = req.body;

  console.log(`Modify request: filePath=${filePath}, instruction=${instruction}`);

  if (!filePath || !instruction) {
    return res.status(400).json({ success: false, error: 'filePath and instruction are required.' });
  }

  if (filePath.includes('..') || !filePath.match(/\.(js|jsx|ts|tsx)$/)) {
    return res.status(400).json({ success: false, error: 'Invalid file path. Only .js, .jsx, .ts, .tsx files are allowed.' });
  }

  if (instruction.length > 1000) {
    return res.status(400).json({ success: false, error: 'Instruction too long (max 1000 characters).' });
  }

  try {
    const originalCode = await readCodeFile(filePath);
    console.log(`Original code length: ${originalCode.length} chars`);
    await backupCodeFile(filePath);

    console.log('Calling Mistral API...');
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'codestral-latest',
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant named Ilamely Kanxo, created by Sandesh Ghimire. Modify the provided code according to the user's instruction. Return only the modified code as a string, without explanations or markdown. Ensure the code is syntactically correct and respects the original structure unless instructed otherwise.`,
          },
          {
            role: 'user',
            content: `File: ${filePath}\n\nCurrent code:\n${originalCode}\n\nInstruction: ${instruction}`,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${mistralApiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    ).catch(err => {
      throw new Error(`Mistral API request failed: ${err.response?.status} ${err.response?.data?.error || err.message}`);
    });

    const modifiedCode = response.data.choices[0].message.content;
    console.log(`Modified code length: ${modifiedCode.length} chars`);
    await writeCodeFile(filePath, modifiedCode);

    res.json({
      success: true,
      message: `File ${filePath} modified successfully.`,
      modifiedCode,
    });
  } catch (err) {
    console.error('❌ Code modification error:', err.message, err.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to modify code.',
      details: err.message,
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Ilamely Kanxo AI Server running at http://localhost:${PORT}`);
});


















/*import express from 'express';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const CODEBASE_DIR = path.resolve('../src/pages/admin');

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const grokApiKey = process.env.GROK_API_KEY;
const mistralApiKey = process.env.MISTRAL_API_KEY;

if (!grokApiKey) {
  console.error('❌ GROK_API_KEY is not set in .env');
  process.exit(1);
}

async function readCodeFile(filePath) {
  try {
    const fullPath = path.join(CODEBASE_DIR, filePath);
    console.log(`Reading file: ${fullPath}`);
    if (!fullPath.startsWith(CODEBASE_DIR)) {
      throw new Error('Access denied: File path is outside codebase directory.');
    }
    if (!await fs.pathExists(fullPath)) {
      throw new Error(`File ${filePath} does not exist.`);
    }
    const content = await fs.readFile(fullPath, 'utf-8');
    return content;
  } catch (err) {
    throw new Error(`Failed to read file ${filePath}: ${err.message}`);
  }
}

async function writeCodeFile(filePath, content) {
  try {
    const fullPath = path.join(CODEBASE_DIR, filePath);
    console.log(`Writing to file: ${fullPath}`);
    if (!fullPath.startsWith(CODEBASE_DIR)) {
      throw new Error('Access denied: File path is outside codebase directory.');
    }
    await fs.writeFile(fullPath, content, 'utf-8');
    return true;
  } catch (err) {
    throw new Error(`Failed to write to file ${filePath}: ${err.message}`);
  }
}

async function backupCodeFile(filePath) {
  try {
    const backupDir = path.join(CODEBASE_DIR, 'backups');
    const backupPath = path.join(backupDir, `${path.basename(filePath)}.backup-${Date.now()}`);
    console.log(`Backing up to: ${backupPath}`);
    await fs.ensureDir(backupDir);
    await fs.copyFile(path.join(CODEBASE_DIR, filePath), backupPath);
  } catch (err) {
    console.error(`Failed to create backup for ${filePath}: ${err.message}`);
  }
}

app.get('/list-files', async (req, res) => {
  try {
    console.log(`Listing files in: ${CODEBASE_DIR}`);
    const files = await fs.readdir(CODEBASE_DIR);
    const codeFiles = files.filter((file) => file.match(/\.(js|jsx|ts|tsx)$/));
    console.log('Files found:', codeFiles);
    res.json({ success: true, files: codeFiles });
  } catch (err) {
    console.error('❌ List files error:', err.message, err.stack);
    res.status(500).json({ success: false, error: 'Failed to list files.', details: err.message });
  }
});

app.post('/modify-code', async (req, res) => {
  const { filePath, instruction } = req.body;

  console.log(`Modify request: filePath=${filePath}, instruction=${instruction}`);

  if (!filePath || !instruction) {
    return res.status(400).json({ success: false, error: 'filePath and instruction are required.' });
  }

  if (filePath.includes('..') || !filePath.match(/\.(js|jsx|ts|tsx)$/)) {
    return res.status(400).json({ success: false, error: 'Invalid file path. Only .js, .jsx, .ts, .tsx files are allowed.' });
  }

  if (instruction.length > 1000) {
    return res.status(400).json({ success: false, error: 'Instruction too long (max 1000 characters).' });
  }

  try {
    const originalCode = await readCodeFile(filePath);
    console.log(`Original code length: ${originalCode.length} chars`);
    await backupCodeFile(filePath);

    console.log('Calling Grok API...');
    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        model: 'grok-3',
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant named Ilamely Kanxo, created by Sandesh Ghimire. Modify the provided code according to the user's instruction. Return only the modified code as a string, without explanations or markdown. Ensure the code is syntactically correct and respects the original structure unless instructed otherwise.`,
          },
          {
            role: 'user',
            content: `File: ${filePath}\n\nCurrent code:\n${originalCode}\n\nInstruction: ${instruction}`,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${grokApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    ).catch(err => {
      throw new Error(`Grok API request failed: ${err.response?.status} ${err.response?.data?.error || err.message}`);
    });

    const modifiedCode = response.data.choices[0].message.content;
    console.log(`Modified code length: ${modifiedCode.length} chars`);
    await writeCodeFile(filePath, modifiedCode);

    res.json({
      success: true,
      message: `File ${filePath} modified successfully.`,
      modifiedCode,
    });
  } catch (err) {
    console.error('❌ Code modification error:', err.message, err.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to modify code.',
      details: err.message,
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Ilamely Kanxo AI Server running at http://localhost:${PORT}`);
});*/