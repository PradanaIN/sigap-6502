const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');

const STORAGE_DIR = path.join(__dirname, '..', '..', 'storage');
const STORAGE_FILE = path.join(STORAGE_DIR, 'contacts.json');
const EXAMPLE_FILE = path.join(STORAGE_DIR, 'contacts.example.json');

const ALLOWED_STATUSES = ['masuk', 'izin', 'cuti', 'sakit', 'dinas', 'libur', 'nonaktif'];

function createError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function ensureStorageFile() {
  await fsPromises.mkdir(STORAGE_DIR, { recursive: true });
  try {
    await fsPromises.access(STORAGE_FILE, fs.constants.F_OK);
  } catch (err) {
    let initialData = JSON.stringify([], null, 2);

    try {
      const exampleContent = await fsPromises.readFile(EXAMPLE_FILE, 'utf8');
      const parsed = JSON.parse(exampleContent);
      if (Array.isArray(parsed)) {
        initialData = JSON.stringify(parsed, null, 2);
      }
    } catch (exampleError) {
      if (exampleError.code !== 'ENOENT') {
        console.warn(
          '[ContactService] Gagal membaca contacts.example.json, membuat file kosong.',
          exampleError
        );
      }
    }

    await fsPromises.writeFile(STORAGE_FILE, initialData, 'utf8');
  }
}

function sanitizeNumber(rawNumber) {
  if (!rawNumber && rawNumber !== 0) return '';
  const digits = String(rawNumber).replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('62')) return digits;
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('8')) return `62${digits}`;
  return digits;
}

function isValidNumber(sanitizedNumber) {
  return /^62\d{8,13}$/.test(sanitizedNumber);
}

function normalizeStatus(status) {
  const normalized = String(status || 'masuk').trim().toLowerCase();
  if (!ALLOWED_STATUSES.includes(normalized)) {
    throw createError(
      `Status tidak valid. Gunakan salah satu dari: ${ALLOWED_STATUSES.join(
        ', '
      )}`
    );
  }
  return normalized;
}

function mapStoredContact(rawContact) {
  if (!rawContact || typeof rawContact !== 'object') {
    return null;
  }

  const sanitizedNumber = sanitizeNumber(rawContact.number);
  const status = ALLOWED_STATUSES.includes(String(rawContact.status).toLowerCase())
    ? String(rawContact.status).toLowerCase()
    : 'masuk';

  return {
    id: rawContact.id || randomUUID(),
    name: typeof rawContact.name === 'string' ? rawContact.name.trim() : '',
    number: sanitizedNumber,
    status,
  };
}

async function readContacts() {
  await ensureStorageFile();
  try {
    const raw = await fsPromises.readFile(STORAGE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error('Konten kontak tidak valid.');
    }

    let needsRewrite = false;
    const contacts = parsed
      .map((contact) => {
        const mapped = mapStoredContact(contact);
        if (!mapped) return null;
        if (!contact.id) {
          needsRewrite = true;
        }
        if (!isValidNumber(mapped.number) || !mapped.name) {
          needsRewrite = true;
          return null;
        }
        return mapped;
      })
      .filter(Boolean);

    if (needsRewrite) {
      await writeContacts(contacts);
    }

    return contacts;
  } catch (err) {
    console.error('[ContactService] Gagal membaca kontak, mengganti dengan file kosong.', err);
    const emptyContacts = JSON.stringify([], null, 2);
    await fsPromises.writeFile(STORAGE_FILE, emptyContacts, 'utf8');
    return [];
  }
}

async function writeContacts(contacts) {
  const sorted = [...contacts].sort((a, b) =>
    a.name.localeCompare(b.name, 'id', { sensitivity: 'base' })
  );
  await fsPromises.writeFile(
    STORAGE_FILE,
    JSON.stringify(sorted, null, 2),
    'utf8'
  );
  return sorted;
}

async function getAllContacts() {
  const contacts = await readContacts();
  return [...contacts].sort((a, b) =>
    a.name.localeCompare(b.name, 'id', { sensitivity: 'base' })
  );
}

async function createContact({ name, number, status }) {
  const trimmedName = typeof name === 'string' ? name.trim() : '';
  if (!trimmedName) {
    throw createError('Nama kontak wajib diisi.');
  }

  const sanitizedNumber = sanitizeNumber(number);
  if (!isValidNumber(sanitizedNumber)) {
    throw createError('Nomor WhatsApp tidak valid. Gunakan format 62XXXXXXXXXXX.');
  }

  const normalizedStatus = normalizeStatus(status);

  const contacts = await readContacts();
  if (contacts.some((contact) => contact.number === sanitizedNumber)) {
    throw createError('Nomor WhatsApp sudah terdaftar.');
  }

  const newContact = {
    id: randomUUID(),
    name: trimmedName,
    number: sanitizedNumber,
    status: normalizedStatus,
  };

  contacts.push(newContact);
  await writeContacts(contacts);

  return newContact;
}

async function updateContact(id, { name, number, status }) {
  if (!id) {
    throw createError('ID kontak wajib diisi.');
  }

  const contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) {
    throw createError('Kontak tidak ditemukan.', 404);
  }

  const updatedContact = { ...contacts[index] };

  if (name !== undefined) {
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    if (!trimmedName) {
      throw createError('Nama kontak wajib diisi.');
    }
    updatedContact.name = trimmedName;
  }

  if (number !== undefined) {
    const sanitizedNumber = sanitizeNumber(number);
    if (!isValidNumber(sanitizedNumber)) {
      throw createError('Nomor WhatsApp tidak valid. Gunakan format 62XXXXXXXXXXX.');
    }
    if (
      contacts.some(
        (contact, contactIndex) =>
          contact.number === sanitizedNumber && contactIndex !== index
      )
    ) {
      throw createError('Nomor WhatsApp sudah terdaftar.');
    }
    updatedContact.number = sanitizedNumber;
  }

  if (status !== undefined) {
    updatedContact.status = normalizeStatus(status);
  }

  contacts[index] = updatedContact;
  await writeContacts(contacts);

  return updatedContact;
}

async function updateContactStatus(id, status) {
  return updateContact(id, { status });
}

async function deleteContact(id) {
  if (!id) {
    throw createError('ID kontak wajib diisi.');
  }

  const contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) {
    throw createError('Kontak tidak ditemukan.', 404);
  }

  const [deletedContact] = contacts.splice(index, 1);
  await writeContacts(contacts);

  return deletedContact;
}

module.exports = {
  getAllContacts,
  createContact,
  updateContact,
  updateContactStatus,
  deleteContact,
  sanitizeNumber,
  isValidNumber,
  ALLOWED_STATUSES,
};
