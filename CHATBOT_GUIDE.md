# 🤖 CampusFix Chatbot - Dokumentasi Fitur

## 📋 Daftar Isi
1. [Pengenalan](#pengenalan)
2. [Fitur Utama](#fitur-utama)
3. [Arsitektur Sistem](#arsitektur-sistem)
4. [Instalasi & Setup](#instalasi--setup)
5. [Integrasi ke Halaman Lain](#integrasi-ke-halaman-lain)
6. [API Endpoints](#api-endpoints)
7. [Database Schema](#database-schema)
8. [Panduan Penggunaan](#panduan-penggunaan)
9. [Troubleshooting](#troubleshooting)

---

## Pengenalan

**CampusFix Chatbot** adalah fitur AI-powered chatbot yang membantu pengguna CampusFix menjawab pertanyaan umum tentang:
- Cara membuat laporan
- Status laporan
- Bantuan akun & login
- Pertanyaan umum tentang sistem

Chatbot ini menggunakan teknologi **keyword matching** yang dapat dikembangkan ke **AI/NLP** di masa depan.

---

## ✨ Fitur Utama

### Untuk Pengguna:
- ✅ **Widget Chat** - Floating chat widget yang dapat diakses dari mana saja
- ✅ **Response Otomatis** - Jawaban instan untuk pertanyaan umum
- ✅ **Chat History** - Menyimpan riwayat percakapan
- ✅ **Feedback System** - Rating untuk setiap respon (👍👎)
- ✅ **Dark Mode Support** - Widget beradaptasi dengan dark/light theme
- ✅ **Responsive Design** - Optimal di desktop, tablet, mobile

### Untuk Developer:
- ✅ **REST API** - Endpoints yang jelas dan konsisten
- ✅ **Session Management** - Tracking percakapan berdasarkan session
- ✅ **Extensible FAQ Database** - Mudah menambah FAQ baru
- ✅ **Analytics** - Tracking yang message yang sering ditanya

---

## 🏗️ Arsitektur Sistem

### Backend (Laravel)
```
app/
├── Controllers/
│   └── ChatbotController.php    # Logika chatbot
├── Models/
│   └── Chat.php                  # Model chat history
└── database/
    └── migrations/
        └── create_chats_table.php # Struktur database
```

### Frontend
```
frontend/
├── css/
│   └── chatbot.css               # Styling widget
├── js/
│   └── chatbot.js                # Logika widget
└── html/
    └── index.html                # Integrasi chatbot
```

---

## 🚀 Instalasi & Setup

### Step 1: Run Migration
```bash
cd backend/campusfix-api
php artisan migrate
```

### Step 2: Verifikasi Routes
Routes chatbot sudah ditambahkan ke `routes/api.php`:
```php
Route::post('/chat/send', [ChatbotController::class, 'sendMessage']);
Route::get('/chat/history', [ChatbotController::class, 'getChatHistory']);
Route::post('/chat/{chatId}/rate', [ChatbotController::class, 'rateResponse']);
Route::get('/chat/faqs', [ChatbotController::class, 'getFaqList']);
```

### Step 3: Start Laravel Server
```bash
php artisan serve
```
Server akan berjalan di `http://localhost:8000`

### Step 4: Update API Base URL (jika berbeda)
Edit file `frontend/js/chatbot.js`, ubah line:
```javascript
apiBaseUrl: 'http://localhost:8000/api'
```

---

## 🔗 Integrasi ke Halaman Lain

### Langkah-langkah Integrasi:

#### 1. Tambahkan CSS & JS ke Header
```html
<link rel="stylesheet" href="../css/chatbot.css">
<script src="../js/chatbot.js"></script>
```

#### 2. Selesai!
Chatbot akan otomatis muncul sebagai floating button di halaman tersebut.

### Contoh Integrasi ke Halaman Admin:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Admin Dashboard</title>
    
    <!-- Chatbot CSS -->
    <link rel="stylesheet" href="../css/chatbot.css">
</head>
<body>
    <!-- Konten admin -->
    
    <!-- Chatbot Script -->
    <script src="../js/chatbot.js"></script>
</body>
</html>
```

### Integrasi ke Halaman Login & Register:
Terapkan langkah yang sama ke file:
- `frontend/html/login.html`
- `frontend/html/register.html`
- `frontend/html/admin.html`
- `frontend/html/mahasiswa.html`

---

## 🔌 API Endpoints

### 1. Send Message
**POST** `/api/chat/send`

Request Body:
```json
{
    "message": "Bagaimana cara membuat laporan?",
    "session_id": "uuid-string-optional"
}
```

Response:
```json
{
    "success": true,
    "session_id": "uuid-string",
    "chat_id": 1,
    "message": "📝 Berikut cara membuat laporan...",
    "category": "report",
    "timestamp": "2026-06-05T10:30:00Z"
}
```

### 2. Get Chat History
**GET** `/api/chat/history?session_id={sessionId}`

Response:
```json
{
    "success": true,
    "chats": [
        {
            "id": 1,
            "user_message": "Halo",
            "bot_response": "Halo! 👋 ...",
            "category": "general",
            "created_at": "2026-06-05T10:30:00Z"
        }
    ]
}
```

### 3. Rate Response
**POST** `/api/chat/{chatId}/rate`

Request Body:
```json
{
    "helpfulness": 1
}
```
(1 = helpful, 0 = not helpful)

Response:
```json
{
    "success": true,
    "message": "Terima kasih atas feedback Anda!"
}
```

### 4. Get FAQ List
**GET** `/api/chat/faqs`

Response:
```json
{
    "success": true,
    "faqs": {
        "general": [...],
        "report": [...],
        "account": [...]
    }
}
```

---

## 💾 Database Schema

### Table: chats
```sql
CREATE TABLE chats (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NULLABLE FOREIGN KEY,
    session_id VARCHAR(255) NULLABLE,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    category VARCHAR(255) DEFAULT 'general',
    helpfulness INT NULLABLE (1 = helpful, 0 = not helpful),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## 📖 Panduan Penggunaan

### Untuk End User:

1. **Buka Chat Widget**
   - Klik tombol floating button 💬 di pojok kanan bawah
   - Widget akan membuka

2. **Kirim Pertanyaan**
   - Ketik pertanyaan Anda di input field
   - Tekan Enter atau klik tombol 📤
   - Chatbot akan memberikan jawaban instan

3. **Rate Response**
   - Setelah mendapat jawaban, Anda bisa memberikan rating
   - Klik 👍 jika jawaban membantu
   - Klik 👎 jika jawaban tidak membantu

4. **Minimize/Close**
   - Klik tombol − untuk minimize
   - Klik tombol × untuk close

### Topik yang Bisa Ditanyakan:

**General:**
- Halo/greeting
- Apa itu CampusFix
- Bantuan

**Report:**
- Cara membuat laporan
- Cara cek status laporan
- Upload foto
- Kategori masalah

**Account:**
- Login
- Register/Daftar
- Logout

---

## 🎯 Cara Menambah FAQ Baru

Edit file `app/Http/Controllers/ChatbotController.php`, cari bagian `$faqDatabase`:

```php
'category_name' => [
    [
        'keywords' => ['kata kunci 1', 'kata kunci 2', 'frasa'],
        'response' => 'Jawaban untuk pertanyaan ini...'
    ],
    // ... FAQ lainnya
]
```

### Contoh Menambah FAQ Baru:
```php
[
    'keywords' => ['teman', 'invite', 'ajak'],
    'response' => '👥 Untuk mengajak teman bergabung dengan CampusFix:\n\n1. Bagikan link CampusFix ke teman\n2. Teman Anda dapat mendaftar akun baru\n3. Mulai membuat laporan bersama-sama!\n\nSemakin banyak pengguna, semakin baik untuk komunitas kampus kita! 🎉'
]
```

---

## 🔧 Customization

### Mengubah Warna Chatbot

Edit `frontend/css/chatbot.css`:

```css
/* Ubah warna gradient */
.chatbot-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* Ganti dengan warna yang diinginkan */
}

.chatbot-message.user .chatbot-message-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* Ganti dengan warna yang diinginkan */
}
```

### Mengubah Posisi Widget

Edit `frontend/js/chatbot.js`, cari `createFloatingButton()`:

```javascript
// Default: bottom: 20px, right: 20px
// Ubah menjadi:
// bottom: 80px, right: 20px (lebih tinggi)
// bottom: 20px, left: 20px (sebelah kiri)
```

### Mengubah Pesan Default

Edit `app/Http/Controllers/ChatbotController.php`, ubah pesan di `$faqDatabase`

---

## 🐛 Troubleshooting

### Masalah: Chatbot tidak muncul
**Solusi:**
- Pastikan file CSS dan JS sudah diinclude dengan benar
- Cek browser console (F12 → Console) untuk error messages
- Pastikan Laravel server sudah running

### Masalah: Response dari API error
**Solusi:**
- Cek apakah `http://localhost:8000` adalah URL yang benar
- Ubah `apiBaseUrl` di `chatbot.js` sesuai URL backend Anda
- Cek Laravel logs: `storage/logs/laravel.log`

### Masalah: Chat history tidak tersimpan
**Solusi:**
- Pastikan migration sudah dijalankan: `php artisan migrate`
- Cek apakah `chats` table sudah dibuat: `php artisan tinker` → `\App\Models\Chat::all()`

### Masalah: Chatbot response lambat
**Solusi:**
- Normal untuk first request (Laravel bootstrapping)
- Subsequent requests akan lebih cepat
- Jika persistently lambat, optimalkan FAQ database

---

## 📊 Analytics & Monitoring

### Monitor Chat Usage
```bash
# Masuk ke Laravel Tinker
php artisan tinker

# Lihat total chats
App\Models\Chat::count()

# Lihat chats berdasarkan kategori
App\Models\Chat::groupBy('category')->selectRaw('category, count(*) as total')->get()

# Lihat feedback rating
App\Models\Chat::where('helpfulness', 1)->count() // helpful
App\Models\Chat::where('helpfulness', 0)->count() // not helpful
```

---

## 🚀 Future Enhancements

- [ ] Integration dengan OpenAI/Claude untuk AI responses
- [ ] Multi-language support (English, Mandarin, etc)
- [ ] Admin dashboard untuk manage FAQ
- [ ] Webhook integration untuk notifikasi
- [ ] Voice input/output support
- [ ] Chatbot analytics dashboard
- [ ] Custom branding & styling admin panel

---

## 📞 Support & Questions

Jika ada pertanyaan atau masalah:
1. Cek troubleshooting section di atas
2. Cek Laravel logs
3. Cek browser console untuk error details
4. Contact admin CampusFix team

---

**Version:** 1.0.0  
**Last Updated:** June 5, 2026  
**Status:** Production Ready ✅
