# Sistem Informasi Pengingat Presensi (SIGAP)

SIGAP menghadirkan pemantauan bot presensi WhatsApp, pengaturan jadwal otomatis maupun manual, serta pemantauan status koneksi bot dalam satu dashboard terpadu sehingga tim dapat memastikan proses presensi berjalan lancar setiap saat.

## Catatan Rilis Terbaru

- **2025-09**: Jadwal default sistem otomatis ditingkatkan ke versi WITA terbaru. Jadwal dengan penanda `updatedBy = system` akan diselaraskan ulang agar menggunakan jam 16:00/16:30 ketika versi baru terdeteksi, dan perubahan ini segera dipublikasikan ke dashboard publik maupun admin.

## Apa yang ada?

- **Monorepo terstruktur** (`backend/` + `frontend/`).
- **Konfigurasi jadwal dinamis** per hari dan override manual per tanggal.
- **Penjadwalan ulang otomatis** ketika jadwal diubah atau override ditambahkan.
- **Otorisasi berlapis**: halaman publik tanpa login, dashboard admin dengan sesi, API kontrol tetap memakai API key.
- **Dashboard admin baru (React + Tailwind)** untuk mengatur jadwal, override, log, dan kontrol bot.
- **Kalender libur lokal** tanpa ketergantungan Google Calendar.
- **Halaman status publik** yang menampilkan jadwal dan pengiriman berikutnya secara real-time.
- **Reliabilitas bot ditingkatkan** dengan pemeriksaan koneksi periodik, watcher konfigurasi, dan restart otomatis.

## Arsitektur

```bash
wa-reminder/
+- backend/              # Layanan Express + WhatsApp bot
¦  +- src/
¦  ¦  +- app.js         # Inisialisasi Express & middleware
¦  ¦  +- server.js      # HTTP + Socket.IO bootstrap
¦  ¦  +- controllers/   # Logika bot, pesan, jadwal
¦  ¦  +- views/         # Halaman fallback server-side (EJS)
¦  +- public/           # Aset statis backend (legacy dashboard)
¦  +- storage/          # `schedule-config.json`, sesi WhatsApp
¦  +- logs/             # Log ter-rotate
¦
+- frontend/            # Aplikasi Vite + React (UI baru)
¦  +- src/
¦  ¦  +- pages/         # PublicStatus, AdminLogin, AdminDashboard
¦  ¦  +- queries/       # React Query hooks (auth, schedule, bot)
¦  ¦  +- components/    # UI kit & komponen utilitas
¦  ¦  +- lib/           # API client
¦  +- public/           # Aset build Vite
¦
+- package.json         # Workspaces + shared scripts
+- README.md
```

### Manajemen Kontak
- **Manajemen kontak pegawai**: Data kontak WhatsApp tersimpan permanen di `backend/storage/contacts.json` (dibuat otomatis dan diabaikan Git) dan dapat diubah melalui API/halaman admin.
- **Manajemen kontak** (`/admin/contacts`): tambah, ubah, hapus kontak pegawai, serta ubah status kehadiran mereka.


## Persyaratan

- Node.js 18 atau lebih baru.
- WhatsApp Web kompatibel (untuk `whatsapp-web.js`).
- (Opsional) Kredensial Google Sheet bila mengaktifkan integrasi tersebut.

## Instalasi

```bash
# Clone repo
git clone https://github.com/pradanain/wa-reminder.git
cd wa-reminder

# Instal semua dependensi (backend + frontend)
npm install
```

### Konfigurasi backend (`backend/.env.local`)

Salin contoh konfigurasi dan isi ulang setiap rahasia dengan nilai baru yang aman:

```bash
cp backend/.env.example backend/.env.local
# kemudian edit backend/.env.local
```

File contoh (`backend/.env.example`) memuat placeholder untuk semua variabel yang dibutuhkan, termasuk:

```env
PORT=3301
WEB_APP_URL=http://localhost:3302
TIMEZONE=Asia/Makassar

ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_me            # untuk pengembangan lokal
# ADMIN_PASSWORD_HASH=               # hash bcrypt untuk produksi
SESSION_SECRET=please-change-this-secret

CONTROL_API_KEY=replace_with_api_key

SPREADSHEET_ID=isi_jika_menggunakan_google_sheet
SPREADSHEET_RANGE=Sheet1!A2:C

SCHEDULER_RETRY_INTERVAL_MS=60000
SCHEDULER_MAX_RETRIES=3
```

> Penting: seluruh rahasia yang sempat tersimpan di repository sudah dicabut. Pastikan mengisi ulang `backend/.env.local` dengan nilai baru sebelum menjalankan aplikasi.

> Catatan: file kredensial sensitif di `backend/config/*.json` diabaikan oleh git. Simpan file asli pada direktori tersebut sebelum menjalankan aplikasi.

### Data kontak backend

- File runtime kontak berada di `backend/storage/contacts.json`. File ini **tidak** dikomit ke repository dan akan dibuat otomatis sebagai array kosong ketika backend pertama kali dijalankan.
- Untuk bootstrap data, salin contoh dari `backend/storage/contacts.example.json` kemudian sesuaikan, atau tambahkan kontak melalui halaman/admin API `POST /api/admin/contacts`.
- Setiap perubahan lewat UI/admin API akan langsung memperbarui file `contacts.json`. Pastikan direktori `backend/storage/` dapat ditulis oleh proses backend (atau dipetakan ke volume ketika menggunakan Docker).

### Konfigurasi frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:3301
```

### Variabel lingkungan runtime frontend (Docker)

Ketika menjalankan image frontend hasil build, konfigurasi proxy Nginx kini
dihasilkan dari templat menggunakan `envsubst`. Gunakan variabel lingkungan
berikut untuk mengarahkan container frontend ke host backend yang sesuai tanpa
perlu rebuild image:

| Variabel        | Default  | Deskripsi                              |
| --------------- | -------- | -------------------------------------- |
| `BACKEND_HOST`  | `backend` | Hostname atau IP backend yang diproksi |
| `BACKEND_PORT`  | `3301`   | Port HTTP backend                      |

Contoh override manual:

```bash
docker run -e BACKEND_HOST=backend.internal -e BACKEND_PORT=8080 \
  -p 80:80 ghcr.io/organisasi/wa-reminder-frontend:latest
```

`docker-compose.yml` juga menyediakan variabel `FRONTEND_BACKEND_HOST` dan
`FRONTEND_BACKEND_PORT` agar mudah dioverride lewat environment host.

## Menjalankan

### Mode pengembangan (backend + frontend bersamaan)

```bash
npm run dev
```

- Backend tersedia di `http://localhost:3301`
- Frontend React tersedia di `http://localhost:5173`

### Menjalankan hanya backend

```bash
npm run dev:backend   # nodemon src/server.js
```

### Menjalankan hanya frontend

```bash
npm run dev:frontend  # vite dev server
```

### Build produksi

```bash
npm run build         # backend: no-op, frontend: vite build
```

Hasil build frontend berada di `frontend/dist/`. Sajikan folder ini melalui CDN atau reverse proxy lalu arahkan `WEB_APP_URL` ke domain produksimu.

## Fitur Backend

- **Penjadwalan dinamis**: `scheduleService` menyimpan jadwal ke `backend/storage/schedule-config.json`. File dibuat otomatis saat pertama kali dijalankan.
- **Override manual**: Override berlaku sekali dan otomatis ditandai setelah pengiriman, lalu dibersihkan.
- **Watcher file**: Perubahan manual pada `schedule-config.json` memicu reschedule otomatis.
- **Auto retry**: Jika WhatsApp client putus, sistem mencoba ulang sampai `SCHEDULER_MAX_RETRIES` dengan interval `SCHEDULER_RETRY_INTERVAL_MS`.
- **API baru**:
  - `GET /api/schedule` & `GET /api/schedule/next-run` (publik)
  - `POST /api/auth/login` & `POST /api/auth/logout`
  - `GET/PUT /api/admin/schedule`
  - `POST/DELETE /api/admin/schedule/overrides`
  - `POST /api/admin/bot/start` dan `POST /api/admin/bot/stop`
  - Endpoint lama `/api/system/*`, `/api/bot/*` tetap tersedia (dengan API key bila diperlukan).

### Pemindaian QR WhatsApp

Saat pertama kali menjalankan bot, Anda perlu memindai QR WhatsApp.

- Lihat QR di terminal: backend sudah mencetak QR ASCII jika berjalan di terminal yang ter-attach.
- Lihat QR di browser:
  - JSON: `GET /api/system/qr` mengembalikan string QR (atau `null`).
  - Gambar: `GET /api/system/qr.svg` menampilkan QR sebagai SVG (mudah di-embed).
  - Halaman siap pakai: buka `http://localhost:3301/qr.html` untuk menampilkan QR dengan refresh otomatis setiap 15 detik.
- Opsi headful (pop-up Chrome): set `PUPPETEER_HEADLESS=false` di environment backend agar jendela Chrome terbuka dan menampilkan QR langsung.
- Persistensi sesi: sesi WhatsApp disimpan di `backend/storage/sessions/` (gunakan volume/mount di Docker agar tidak perlu scan ulang).

## Fitur Frontend

- **Halaman publik** (`/`) menampilkan status bot, jadwal harian, dan pengiriman berikutnya.
- **Login admin** (`/admin/login`) dengan sesi cookie.
- **Dashboard admin** (`/admin/dashboard`):
  - Edit jadwal harian (time picker per hari).
  - Mengatur zona waktu dan pause scheduler.
  - Mengelola override manual (tambah/hapus).
  - Kontrol bot (start/stop) + indikator status.
  - Viewer log real-time (auto refresh).
- Dibangun dengan React + React Router + React Query + Tailwind v4.

## Catatan Operasional

- `backend/storage/schedule-config.json` dan `backend/storage/sessions/` diabaikan dari git namun disimpan lokal untuk menjalankan bot.
- Pastikan direktori `backend/logs/` writable, log akan dirotasi harian oleh Winston.
- Untuk produksi, gunakan reverse proxy (nginx/traefik) untuk mengamankan backend dan sajikan frontend hasil build.
- Backup file `schedule-config.json` bila ingin menjaga riwayat konfigurasi jadwal.

## Script bantu (root)

| Perintah               | Deskripsi                                       |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Jalankan backend + frontend bersamaan           |
| `npm run dev:backend`  | Jalankan backend saja (nodemon)                 |
| `npm run dev:frontend` | Jalankan frontend (Vite)                        |
| `npm run build`        | Build frontend (backend tidak memerlukan build) |
| `npm run lint`         | Lint backend (`eslint --ext .js src`)           |

---

Selamat menikmati arsitektur baru! Jika menemukan kendala atau ingin menambahkan fitur, lanjutkan dengan membuat branch baru dan pull request sesuai kebutuhan.
