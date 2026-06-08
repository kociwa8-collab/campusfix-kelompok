# 🔧 Fix: Chatbot Terefresh - Troubleshooting Guide

## ✅ Perbaikan yang Sudah Dilakukan

1. **Event Listeners** - Ditambahkan `stopPropagation()` untuk mencegah event bubbling
2. **Initialization** - Ditambahkan safety check agar hanya init satu kali
3. **Error Handling** - Ditambahkan try-catch di semua method
4. **API Timeout** - Ditambahkan timeout handling
5. **Feedback Buttons** - Diperbaiki agar tidak error saat di-klik

---

## 🚀 Cara Testing

### Langkah 1: Pastikan Backend Running
```bash
cd backend/campusfix-api
php artisan serve
```
✅ Harus muncul: `Laravel development server started on http://127.0.0.1:8000`

### Langkah 2: Test dengan Test Console
1. Buka: `frontend/html/test-chatbot.html` di browser
2. Klik tombol-tombol test satu per satu:
   - **Test API Connection** → harus ✅
   - **Check LocalStorage** → harus ✅  
   - **Check Chatbot** → harus ✅
   - **Send Test Message** → harus ✅

### Langkah 3: Coba di Halaman Asli
1. Login di `login.html` terlebih dahulu (PENTING!)
2. Barulah buka `index.html` (dashboard mahasiswa)
3. Lihat apakah ada floating button 💬 di pojok kanan bawah

---

## ⚠️ Jika Masih Terefresh

### Check 1: Browser Console
1. Buka halaman (F12)
2. Tab **Console**
3. Lihat apakah ada error messages
4. Screenshot error dan kirim ke saya

### Check 2: API Backend
Pastikan API running dengan membuka: `http://localhost:8000/api/chat/faqs`
- ✅ Harus muncul JSON dengan FAQ list
- ❌ Jika error 404 atau timeout = backend tidak jalan

### Check 3: Login Status
Refresh halaman `index.html`:
- Jika redirect ke `login.html` = User belum login
- Pastikan sudah login terlebih dahulu!

---

## 🐛 Common Issues & Solutions

| Issue | Penyebab | Solusi |
|-------|---------|--------|
| Chatbot tidak muncul | CSS/JS tidak load | Cek file `chatbot.css` & `chatbot.js` ada |
| Infinite refresh | User belum login | Login terlebih dahulu ke `login.html` |
| "Cannot connect" error | Backend tidak running | Jalankan `php artisan serve` |
| Blank chatbot | API error | Cek console log & backend error |
| Feedback button error | JavaScript error | Cek console F12 untuk detail error |

---

## 📝 Test Checklist

Sebelum melaporkan issue, pastikan sudah:

- [ ] Laravel server running (`php artisan serve`)
- [ ] Database migration sudah run (`php artisan migrate`)
- [ ] Sudah login ke akun mahasiswa
- [ ] Membuka halaman yang benar (`index.html`, bukan `login.html`)
- [ ] Sudah clear browser cache (Ctrl+Shift+Del)
- [ ] Chatbot CSS & JS file sudah terintegrasi di HTML

---

## 💡 Debugging Tips

### Debug via Test Console
```html
<!-- Buka: frontend/html/test-chatbot.html -->
<!-- Ini akan test semua komponen dan show log -->
```

### Debug via Browser Console
```javascript
// Buka F12 → Console, ketik:

// Check if chatbot loaded
console.log(window.chatbot);

// Check session ID
console.log(localStorage.getItem('chatbot_session_id'));

// Check user login
console.log(JSON.parse(localStorage.getItem('user')));

// Test API
fetch('http://localhost:8000/api/chat/faqs')
    .then(r => r.json())
    .then(d => console.log(d));
```

---

## 📋 File yang Diperbaiki

- ✅ `frontend/js/chatbot.js` - Fixed infinite loop & event issues
- ✅ `frontend/html/index.html` - Verified integration
- ✅ `frontend/html/login.html` - Verified integration
- ✅ `frontend/html/admin.html` - Verified integration
- ✅ `frontend/html/test-chatbot.html` - NEW: Test console

---

## 🎯 Next Steps

1. **Test dulu** dengan `test-chatbot.html`
2. **Lihat console** untuk cari error
3. **Pastikan login** sebelum akses `index.html`
4. **Report issue** jika masih ada dengan screenshot error

---

**Untuk bantuan lebih lanjut, buka file `CHATBOT_GUIDE.md` untuk dokumentasi lengkap.**
