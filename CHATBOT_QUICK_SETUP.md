# ⚡ Quick Setup Chatbot CampusFix

## 🎯 Setup dalam 3 Langkah

### 1️⃣ Run Migration Database
```bash
cd backend/campusfix-api
php artisan migrate
```

### 2️⃣ Pastikan Laravel Server Running
```bash
php artisan serve
# Server akan jalan di http://localhost:8000
```

### 3️⃣ Selesai! ✅
Chatbot sudah terintegrasi di `frontend/html/index.html`

---

## 📱 Coba Chatbot
1. Buka `http://localhost` (atau sesuai URL frontend Anda)
2. Login sebagai mahasiswa
3. Lihat floating button 💬 di pojok kanan bawah
4. Klik untuk membuka chatbot

---

## 🔗 Integrasi ke Halaman Lain

Tambahkan 2 baris ini ke file HTML manapun:

```html
<!-- Di dalam <head> tag -->
<link rel="stylesheet" href="../css/chatbot.css">

<!-- Di akhir </body> tag -->
<script src="../js/chatbot.js"></script>
```

---

## 📝 File Yang Ditambahkan

### Backend
- ✅ `app/Http/Controllers/ChatbotController.php` - Logika chatbot
- ✅ `app/Models/Chat.php` - Model Chat
- ✅ `database/migrations/2026_06_05_000000_create_chats_table.php` - DB Schema
- ✅ `routes/api.php` - Updated dengan chatbot routes

### Frontend
- ✅ `frontend/css/chatbot.css` - Styling chatbot
- ✅ `frontend/js/chatbot.js` - Logika widget
- ✅ `frontend/html/index.html` - Updated dengan chatbot integration

### Dokumentasi
- ✅ `CHATBOT_GUIDE.md` - Dokumentasi lengkap
- ✅ `CHATBOT_QUICK_SETUP.md` - Quick setup ini

---

## ⚙️ API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/chat/send` | Kirim pesan ke chatbot |
| GET | `/api/chat/history` | Ambil riwayat chat |
| POST | `/api/chat/{id}/rate` | Rate response chatbot |
| GET | `/api/chat/faqs` | Lihat semua FAQ |

---

## 🎨 Pertanyaan yang Bisa Dijawab

**Umum:**
- "Halo", "Bantuan", "Apa itu CampusFix"

**Laporan:**
- "Cara membuat laporan", "Cek status", "Upload foto"

**Akun:**
- "Cara login", "Daftar", "Logout"

---

## 🐛 Troubleshooting

| Masalah | Solusi |
|---------|---------|
| Chatbot tidak muncul | Cek apakah CSS/JS di-load dengan benar |
| Response error | Pastikan Laravel server running di http://localhost:8000 |
| Chat tidak tersimpan | Cek apakah migration sudah berjalan |

---

## 📖 Dokumentasi Lengkap

Baca file `CHATBOT_GUIDE.md` untuk dokumentasi lengkap termasuk:
- Custom FAQ
- Advanced customization
- Analytics
- Troubleshooting detail

---

**Status: Ready to Use ✅**

Selamat! Chatbot sudah siap digunakan dalam sistem CampusFix Anda!
