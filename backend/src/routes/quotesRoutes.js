const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const { requireAdmin } = require('../middleware/adminAuth');

const router = express.Router();

const QUOTES_FILE = path.join(__dirname, '..', 'templates', 'quotes.txt');

async function readQuotes() {
  try {
    const raw = await fs.readFile(QUOTES_FILE, 'utf-8');
    return raw
      .split('\n')
      .map((q) => q.trim())
      .filter((q) => q.length > 0);
  } catch (_) {
    return [];
  }
}

async function writeQuotes(list) {
  const content = list.join('\n');
  await fs.writeFile(QUOTES_FILE, content, 'utf-8');
}

function toObjects(list) {
  return list.map((content, idx) => ({ id: idx + 1, content }));
}

// Public: list quotes
router.get('/', async (req, res) => {
  try {
    const list = await readQuotes();
    return res.json({ quotes: toObjects(list) });
  } catch (err) {
    return res.status(500).json({ message: 'Gagal membaca data quotes.' });
  }
});

// Admin: create quote
router.post('/', requireAdmin, async (req, res) => {
  try {
    const value = String(req.body?.content || '').trim();
    if (!value) {
      return res.status(400).json({ message: 'Isi quote tidak boleh kosong.' });
    }

    const list = await readQuotes();
    list.push(value);
    await writeQuotes(list);

    const id = list.length;
    return res.status(201).json({ id, content: value });
  } catch (err) {
    return res.status(500).json({ message: 'Gagal menambah quote.' });
  }
});

// Admin: update quote by id (1-based)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ message: 'ID tidak valid.' });
    }

    const value = String(req.body?.content || '').trim();
    if (!value) {
      return res.status(400).json({ message: 'Isi quote tidak boleh kosong.' });
    }

    const list = await readQuotes();
    if (id > list.length) {
      return res.status(404).json({ message: 'Quote tidak ditemukan.' });
    }

    list[id - 1] = value;
    await writeQuotes(list);
    return res.json({ id, content: value });
  } catch (err) {
    return res.status(500).json({ message: 'Gagal memperbarui quote.' });
  }
});

// Admin: delete quote by id (1-based)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ message: 'ID tidak valid.' });
    }

    const list = await readQuotes();
    if (id > list.length) {
      return res.status(404).json({ message: 'Quote tidak ditemukan.' });
    }

    list.splice(id - 1, 1);
    await writeQuotes(list);
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ message: 'Gagal menghapus quote.' });
  }
});

module.exports = router;

