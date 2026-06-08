# 🏫 CampusFix - Sistem Pelaporan Fasilitas Kampus

![CampusFix](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=flat-square)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**CampusFix** adalah platform web modern untuk pelaporan dan manajemen fasilitas kampus. Sistem ini memungkinkan mahasiswa melaporkan kerusakan atau masalah fasilitas kampus dengan mudah, sementara admin dapat memantau, memproses, dan menyelesaikan laporan dengan efisien.

---

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Struktur Proyek](#struktur-proyek)
- [Instalasi & Setup](#instalasi--setup)
- [Panduan Penggunaan](#panduan-penggunaan)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [User Roles & Permissions](#user-roles--permissions)
- [Screenshots](#screenshots)
- [Troubleshooting](#troubleshooting)
- [Tim Pengembang](#tim-pengembang)

---

## ✨ Fitur Utama

### 🎯 Untuk Mahasiswa
- ✅ **Registrasi & Login** - Autentikasi aman dengan password encryption
- ✅ **Buat Laporan** - Form lengkap dengan lokasi, kategori, deskripsi, dan upload foto
- ✅ **Pantau Status** - Lihat status laporan real-time (Menunggu, Diproses, Selesai)
- ✅ **Riwayat Laporan** - Akses semua laporan yang telah dibuat
- ✅ **Dashboard Personal** - Welcome section dan statistik laporan

### 👨‍💼 Untuk Admin
- ✅ **Dashboard Analytics** - Statistik total laporan, sedang diproses, dan selesai
- ✅ **Manajemen Laporan** - Lihat, filter, dan cari laporan masuk
- ✅ **Update Status** - Ubah status laporan (Menunggu → Diproses → Selesai)
- ✅ **Preview Foto** - Modal preview untuk melihat foto bukti laporan
- ✅ **Sidebar Navigation** - Menu navigasi yang user-friendly
- ✅ **User Management** - Kelola data pengguna

### 🎨 UI/UX
- ✅ **Design Modern & Premium** - Interface yang elegan dan profesional
- ✅ **Responsive Design** - Optimal di desktop, tablet, dan mobile
- ✅ **Dark Mode Ready** - Struktur warna yang eye-friendly
- ✅ **Smooth Animations** - Transisi yang halus dan natural
- ✅ **Accessible** - WCAG compliant markup

---

## 🛠 Tech Stack

### Backend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Laravel** | 12 | Framework PHP untuk backend API |
| **PHP** | 8.2+ | Server-side language |
| **SQLite** | - | Database untuk development & production |
| **Laravel Sanctum** | Latest | API Authentication & Authorization |
| **Vite** | Latest | Build tool & module bundler |

### Frontend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **HTML5** | - | Semantic markup |
| **CSS3** | - | Modern styling dengan CSS variables |
| **JavaScript (ES6+)** | - | Vanilla JS untuk interaktivitas |
| **Axios** | Latest | HTTP client untuk API calls |

### Tools & Services
| Tools | Fungsi |
|-------|--------|
| **Git** | Version control |
| **Docker** (Optional) | Containerization |
| **PHPUnit** | Testing framework |
| **Composer** | PHP dependency manager |
| **npm** | JavaScript package manager |

---

## 📁 Struktur Proyek

```
campusfix_kelompok/
│
├── 📂 backend/
│   └── 📂 campusfix-api/              # Laravel Application Root
│       ├── app/
│       │   ├── Http/
│       │   │   └── Controllers/
│       │   │       ├── AuthController.php       # Auth logic (register, login)
│       │   │       ├── ReportController.php     # Report CRUD operations
│       │   │       └── Controller.php
│       │   ├── Models/
│       │   │   ├── User.php           # User model dengan role
│       │   │   └── Report.php         # Report model dengan relationships
│       │   └── Providers/
│       │       └── AppServiceProvider.php
│       │
│       ├── config/                     # Configuration files
│       │   ├── app.php
│       │   ├── auth.php
│       │   ├── database.php
│       │   ├── cors.php
│       │   └── ...
│       │
│       ├── database/
│       │   ├── migrations/             # Database schema
│       │   │   ├── 0001_01_01_000000_create_users_table.php
│       │   │   ├── 2026_05_28_083832_create_reports_table.php
│       │   │   └── ...
│       │   ├── factories/
│       │   │   └── UserFactory.php
│       │   └── seeders/
│       │       └── DatabaseSeeder.php
│       │
│       ├── routes/
│       │   ├── api.php                 # API routes (main routing file)
│       │   ├── web.php
│       │   └── console.php
│       │
│       ├── public/
│       │   ├── index.php               # Entry point
│       │   └── uploads/                # Report photo storage
│       │
│       ├── storage/
│       │   └── logs/                   # Application logs
│       │
│       ├── tests/                      # Test files
│       │   ├── Feature/
│       │   └── Unit/
│       │
│       ├── composer.json               # PHP dependencies
│       ├── package.json                # JS dependencies
│       ├── vite.config.js              # Vite configuration
│       ├── phpunit.xml                 # PHPUnit config
│       ├── .env                        # Environment variables
│       └── artisan                     # Laravel CLI
│
├── 📂 frontend/
│   ├── 📂 html/
│   │   ├── index.html                  # Landing page
│   │   ├── login.html                  # Login page (split screen)
│   │   ├── register.html               # Register page (split screen)
│   │   ├── mahasiswa.html              # Student dashboard
│   │   └── admin.html                  # Admin dashboard
│   │
│   ├── 📂 css/
│   │   └── style.css                   # Main stylesheet (premium design)
│   │
│   └── 📂 js/
│       ├── login.js                    # Login logic
│       ├── register.js                 # Register logic
│       ├── mahasiswa.js                # Student dashboard logic
│       ├── admin.js                    # Admin dashboard logic
│       └── laporan.js                  # Report management utilities
│
└── 📂 database/                        # Database backups/exports
    └── (reserved for future use)
```

---

## 🚀 Instalasi & Setup

### Prerequisites
- PHP 8.2 atau lebih tinggi
- Composer (Package manager PHP)
- Node.js & npm
- Git
- Database: SQLite (built-in Laravel)

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd campusfix_kelompok
```

### Step 2: Setup Backend (Laravel)
```bash
cd backend/campusfix-api

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations (create database tables)
php artisan migrate

# (Optional) Seed database dengan data dummy
php artisan db:seed

# Install JS dependencies
npm install
```

### Step 3: Konfigurasi Environment
Edit file `.env` di `backend/campusfix-api/`:
```env
APP_NAME=CampusFix
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

# Database Configuration
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# API Configuration
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
```

### Step 4: Jalankan Development Server

**Terminal 1 - Backend Laravel:**
```bash
cd backend/campusfix-api
php artisan serve
# Server akan berjalan di http://127.0.0.1:8000
```

**Terminal 2 - Frontend (Optional untuk Vite):**
```bash
cd backend/campusfix-api
npm run dev
```

### Step 5: Buka Frontend
Buka browser dan akses:
```
http://127.0.0.1:8000/frontend/html/index.html
```

atau buka file langsung:
```
f:\campusfix_kelompok\frontend\html\index.html
```

---

## 📖 Panduan Penggunaan

### 🔐 User Roles

#### 1. Guest (Tidak Login)
- Lihat landing page
- Akses halaman login & register
- Tidak bisa akses dashboard

#### 2. Mahasiswa (Student)
**Login:** Gunakan akun mahasiswa yang sudah terdaftar

**Akses:**
- Dashboard mahasiswa (`mahasiswa.html`)
- Buat laporan baru
- Lihat riwayat laporan
- Pantau status laporan

**Fitur:**
- Form buat laporan dengan foto
- Real-time status update
- Filter berdasarkan status

#### 3. Admin
**Login:** Gunakan akun admin (role: 'admin')

**Akses:**
- Dashboard admin (`admin.html`)
- Lihat semua laporan dari semua mahasiswa
- Update status laporan

**Fitur:**
- View 3 statistik utama (Total, Diproses, Selesai)
- Sidebar navigation
- Search & filter laporan
- Update status laporan (Menunggu → Diproses → Selesai)
- Preview foto bukti
- Export (future feature)

---

### 📝 Alur Penggunaan

#### Alur Mahasiswa
```
1. Register/Login
   ↓
2. Buka Dashboard Mahasiswa
   ↓
3. Isi Form Laporan
   - Lokasi
   - Kategori Masalah
   - Deskripsi
   - Upload Foto (Optional)
   ↓
4. Klik "Kirim Laporan"
   ↓
5. Laporan muncul di "Riwayat Laporan"
   ↓
6. Pantau status laporan (Menunggu → Diproses → Selesai)
```

#### Alur Admin
```
1. Login dengan akun admin
   ↓
2. Lihat Dashboard Admin
   ├── Statistik: Total, Diproses, Selesai
   ├── Sidebar dengan menu
   └── Daftar semua laporan
   ↓
3. Lihat Detail Laporan
   - Lokasi
   - Kategori
   - Deskripsi
   - Foto (klik untuk preview)
   ↓
4. Update Status Laporan
   - Klik "Mulai Proses" → Status: Diproses
   - Klik "Tandai Selesai" → Status: Selesai
   ↓
5. Laporan terupdate di dashboard mahasiswa
```

---

## 🔌 API Endpoints

Base URL: `http://127.0.0.1:8000/api/`

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Daftar akun mahasiswa baru | ❌ No |
| POST | `/login` | Login dengan email & password | ❌ No |

### Report Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/reports` | Get semua laporan | ✅ Yes |
| POST | `/reports` | Create laporan baru | ✅ Yes |
| PUT | `/reports/{id}` | Update laporan (khususnya status) | ✅ Yes |
| GET | `/myreports/{userId}` | Get laporan spesifik user | ✅ Yes |

### Request/Response Examples

#### 1. Register
```bash
POST /register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@university.ac.id",
  "password": "password123"
}

Response (200):
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@university.ac.id",
    "role": "user"
  }
}
```

#### 2. Login
```bash
POST /login
Content-Type: application/json

{
  "email": "john@university.ac.id",
  "password": "password123"
}

Response (200):
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@university.ac.id",
    "role": "user"
  },
  "token": "1|abcdefghijklmnop..."
}
```

#### 3. Create Report
```bash
POST /reports
Content-Type: multipart/form-data

{
  "user_id": 1,
  "location": "Gedung A, Ruang 101",
  "category": "Kerusakan Kaca",
  "description": "Jendela pecah di sudut ruangan",
  "photo": <file>
}

Response (201):
{
  "message": "Report created successfully",
  "report": {
    "id": 5,
    "user_id": 1,
    "location": "Gedung A, Ruang 101",
    "category": "Kerusakan Kaca",
    "description": "Jendela pecah di sudut ruangan",
    "photo": "1780049604.png",
    "status": "Pending",
    "created_at": "2026-05-28T08:40:04.000000Z"
  }
}
```

#### 4. Get All Reports
```bash
GET /reports

Response (200):
{
  "reports": [
    {
      "id": 1,
      "user_id": 1,
      "location": "Gedung A",
      "category": "Kerusakan Kaca",
      "description": "Jendela pecah",
      "photo": "1780049604.png",
      "status": "Selesai",
      "created_at": "2026-05-28T08:40:04.000000Z"
    },
    ...
  ]
}
```

#### 5. Update Report Status
```bash
PUT /reports/1
Content-Type: application/json

{
  "status": "Diproses"
}

Response (200):
{
  "message": "Report updated successfully",
  "report": {
    "id": 1,
    "status": "Diproses",
    ...
  }
}
```

---

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user', -- 'user' atau 'admin'
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Reports Table
```sql
CREATE TABLE reports (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  location VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  photo VARCHAR(255), -- Nama file foto
  status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Diproses', 'Selesai'
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Relationships
```
User (1) ─── Many (Reports)
  └─ One user bisa memiliki banyak reports
Reports (Many) ─── One (User)
  └─ Setiap report milik satu user
```

---

## 👥 User Roles & Permissions

### Mahasiswa (User)
| Action | Permission |
|--------|-----------|
| Register | ✅ |
| Login | ✅ |
| Create Report | ✅ |
| View Own Reports | ✅ |
| View Report Status | ✅ |
| Update Own Report | ❌ |
| Delete Report | ❌ |
| View All Reports | ❌ |
| Update Report Status | ❌ |

### Admin
| Action | Permission |
|--------|-----------|
| Register | ✅ (Pre-created) |
| Login | ✅ |
| View All Reports | ✅ |
| Update Report Status | ✅ |
| Delete Report | ✅ |
| Manage Users | ✅ (Future) |
| Export Reports | ✅ (Future) |

---

## 🎨 Screenshots

### Landing Page
- Header dengan branding CampusFix
- Call-to-action buttons (Login, Register)
- Deskripsi singkat tentang platform

### Login Page (Split Screen)
- Sisi kiri: Branding section dengan gradient
- Sisi kanan: Form login premium
- Responsive design untuk mobile

### Register Page (Split Screen)
- Sisi kiri: Branding section
- Sisi kanan: Form register dengan validasi
- Input untuk name, email, password

### Dashboard Mahasiswa
- Welcome section personal
- Form buat laporan
- Riwayat laporan dalam card list
- Status badge dengan warna berbeda
- Navbar premium dengan logout

### Dashboard Admin
- Sidebar navigasi
- 3 statistik cards (Total, Diproses, Selesai)
- Search & filter bar
- Daftar laporan dalam card format
- Action buttons (Mulai Proses, Tandai Selesai)
- Modal preview foto
- Responsive sidebar collapse di mobile

---

## 🐛 Troubleshooting

### Problem: Laravel artisan command tidak ditemukan
**Solusi:**
```bash
# Pastikan Anda di folder campusfix-api
cd backend/campusfix-api

# Atau gunakan
php artisan serve
```

### Problem: Database error "database.sqlite not found"
**Solusi:**
```bash
cd backend/campusfix-api

# Jalankan migration untuk membuat database
php artisan migrate

# Atau reset database (hapus data lama)
php artisan migrate:fresh
```

### Problem: Port 8000 sudah terpakai
**Solusi:**
```bash
# Gunakan port lain
php artisan serve --port=8001
```

### Problem: CORS error saat fetch API
**Solusi:**
Cek file `config/cors.php` di backend:
```php
'allowed_origins' => ['*'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

### Problem: Foto tidak bisa upload
**Solusi:**
```bash
# Pastikan folder public/uploads punya permission write
chmod 755 public/uploads
chmod 755 storage/app/public

# Atau di Windows, set folder properties → Security → Everyone → Full Control
```

### Problem: localStorage tidak menyimpan user data
**Solusi:**
- Pastikan browser bukan private/incognito mode
- Check browser console untuk error
- Pastikan JavaScript tidak di-block

---

## 📊 Performance & Optimization

### Backend Optimization
- ✅ Eloquent query optimization
- ✅ Database indexing pada frequently queried columns
- ✅ Laravel caching untuk repeated queries
- ✅ API response compression

### Frontend Optimization
- ✅ CSS minification
- ✅ JavaScript bundling dengan Vite
- ✅ Image optimization
- ✅ Lazy loading untuk images
- ✅ Local storage caching untuk user data

---

## 🔒 Security Features

- ✅ **Authentication** - Laravel Sanctum untuk API auth
- ✅ **Password Encryption** - bcrypt hashing
- ✅ **CORS Protection** - Mencegah cross-origin attack
- ✅ **SQL Injection Prevention** - Eloquent ORM dengan parameter binding
- ✅ **CSRF Protection** - Token-based verification
- ✅ **Rate Limiting** - API rate limiting (future)
- ✅ **Input Validation** - Server-side validation

---

## 📈 Future Enhancements

- [ ] Export laporan ke PDF/Excel
- [ ] Email notifications untuk status update
- [ ] Real-time updates dengan WebSocket
- [ ] Multi-file upload untuk laporan
- [ ] Advanced analytics & reporting
- [ ] Mobile app (React Native/Flutter)
- [ ] Workflow automation
- [ ] QR code untuk tracking laporan
- [ ] Integration dengan maintenance team chat

---

## 📄 License

CampusFix dilisensikan di bawah **MIT License**. Lihat file LICENSE untuk detail.

---

## 👨‍💻 Tim Pengembang

**Project:** CampusFix - Sistem Pelaporan Fasilitas Kampus  
**Status:** ✅ Production Ready v1.0.0  
**Last Updated:** June 2, 2026

### Contributors
- **Frontend:** Premium UI/UX with modern design system
- **Backend:** RESTful API dengan Laravel 12
- **Database:** SQLite untuk development & production

---

## 📞 Support & Contact

Untuk pertanyaan, bug reports, atau suggestions:

1. **Create Issue** - Report bugs di issue tracker
2. **Pull Request** - Submit improvements
3. **Documentation** - Baca file ini lebih teliti

---

## 📚 Resources

- [Laravel Documentation](https://laravel.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)
- [API Best Practices](https://restfulapi.net/)
- [Modern CSS](https://web.dev/learn/css/)

---

**Happy Coding! 🚀**

*Terima kasih telah menggunakan CampusFix. Mari bersama-sama menjaga fasilitas kampus tetap optimal!*
