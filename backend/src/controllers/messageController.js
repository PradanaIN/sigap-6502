const fs = require('fs');
const path = require('path');
const { getRandomQuote } = require('../utils/quotes');
const { resetHeartbeat } = require('../utils/heartbeat');
const { getAllContacts } = require('../services/contactService');
const { LOG_AUDIENCES } = require('./logController');

function logPublic(addLog, message) {
  if (typeof addLog !== 'function') {
    return;
  }
  addLog(message, { audience: LOG_AUDIENCES.PUBLIC });
}

function getPublicDisplayName(name) {
  if (!name || typeof name !== 'string') {
    return 'Kontak';
  }

  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : 'Kontak';
}

async function loadContacts() {
  try {
    const contacts = await getAllContacts();
    const eligibleContacts = Array.isArray(contacts)
      ? contacts.filter((contact) => contact.status === 'masuk')
      : [];

    if (!Array.isArray(eligibleContacts) || eligibleContacts.length === 0) {
      console.log('[Message] Tidak ada kontak yang ditemukan.');
      return [];
    }
    return eligibleContacts.map(({ name, number }) => ({ name, number }));
  } catch (err) {
    console.error('[Message] Gagal baca kontak:', err);
    return [];
  }
}

function loadMessageTemplate() {
  try {
    return fs.readFileSync(
      path.join(__dirname, '..', 'templates', 'message_template.txt'),
      'utf-8'
    );
  } catch (err) {
    console.error('[Message] Gagal baca template:', err);
    return null;
  }
}

// getRandomQuote now reads from file per-use via utils/quotes

async function sendMessage(number, message, client) {
  const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
  await client.sendMessage(chatId, message);
}

async function sendMessageToNumber(client, number, name, addLog = console.log) {
  try {
    const template = loadMessageTemplate();
    const quote = await getRandomQuote();
    const message = template.replace('{name}', name).replace('{quote}', quote);

    const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
    await client.sendMessage(chatId, message);
    const publicName = getPublicDisplayName(name);
    addLog(`[Message] ? Pesan berhasil dikirim ke ${name} (${number})`);
    logPublic(
      addLog,
      `[Message] ? Pesan berhasil dikirim ke ${publicName}`
    );
    return true;
  } catch (err) {
    const publicName = getPublicDisplayName(name);
    addLog(`[Message] ? Gagal kirim ke ${name} (${number})`);
    logPublic(
      addLog,
      `[Message] ? Gagal kirim ke ${publicName}`
    );
    addLog(`[Message] ?? Error: ${err.name} - ${err.message}`);
    return false;
  }
}

async function sendMessagesToAll(client, addLog = console.log) {
  if (!client) {
    addLog('[Message] ? Client tidak tersedia.');
    return { successCount: 0, failedCount: 0, total: 0 };
  }

  let state;
  try {
    state = await client.getState();
  } catch (err) {
    addLog('[Message] ? Gagal mendapatkan state client.');
    return { successCount: 0, failedCount: 0, total: 0 };
  }

  if (state !== 'CONNECTED') {
    addLog(`[Message] ? Client state bukan CONNECTED: ${state}`);
    return { successCount: 0, failedCount: 0, total: 0 };
  }

  const contacts = await loadContacts();
  if (!Array.isArray(contacts) || contacts.length === 0) {
    addLog('[Message] Tidak ada kontak yang ditemukan.');
    return { successCount: 0, failedCount: 0, total: 0 };
  }

  addLog(`[Message] ?? Mengirim pesan ke ${contacts.length} kontak...`);
  logPublic(
    addLog,
    `[Message] ?? Mengirim pesan ke ${contacts.length} kontak...`
  );

  let successCount = 0;
  let failedCount = 0;

  await Promise.all(
    contacts.map(
      (contact, index) =>
        new Promise((resolve) => {
          setTimeout(async () => {
            const success = await sendMessageToNumber(
              client,
              contact.number,
              contact.name,
              addLog
            );
            if (success) successCount++;
            else failedCount++;
            resolve();
          }, index * 1500);
        })
    )
  );

  addLog(
    `[Message] ? Pengiriman selesai: ${successCount} sukses, ${failedCount} gagal.`
  );
  logPublic(
    addLog,
    `[Message] ? Pengiriman selesai: ${successCount} sukses, ${failedCount} gagal.`
  );
  resetHeartbeat();

  return {
    successCount,
    failedCount,
    total: contacts.length,
  };
}

module.exports = {
  sendMessage,
  sendMessagesToAll,
  sendMessageToNumber,
  loadContacts,
};
