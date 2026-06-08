# 🔧 Changelog - CampusFix Project

## 📝 Version 1.0.3 - Dark Mode & Light Mode Theme Toggle

### ✨ Fitur Baru
✅ **Dark Mode / Light Mode** - Full theme support dengan:
   - 🌙 **Dark Mode** - Background gelap (#0F172A), text cerah, eye-friendly
   - ☀️ **Light Mode** - Background terang (#F8FAFC), text gelap, professional
   - 🎨 **Automatic Detection** - Menggunakan system preference secara default
   - 💾 **Persistent Storage** - Pilihan tema tersimpan di localStorage
   - ✨ **Smooth Transitions** - Animasi transisi halus 0.3s saat tema berubah

✅ **Theme Toggle Button** - Button keren di navbar dengan:
   - 🎯 **Glassmorphic Design** - Semi-transparent background dengan blur effect
   - 🎪 **Interactive Ripple Effect** - Ripple animation saat diklik
   - 🌐 **Available di Semua Pages** - Landing, Login, Register, Dashboard
   - 🎨 **Icon Toggle** - ☀️ untuk Light Mode, 🌙 untuk Dark Mode
   - 🔄 **Instant Update** - Tema berubah dengan animasi smooth

✅ **Full Theme System** - Semua elemen berubah dengan sempurna:
   - Background colors (navy → dark navy, white → dark gray)
   - Text colors (automatically inverted)
   - Cards dan containers (white → dark gray with proper contrast)
   - Form elements (input, textarea, select)
   - Buttons dengan proper hover states
   - Sidebar (dark navy dengan lighting adjustment)
   - Modals dan overlays
   - Shadows (disesuaikan untuk visibility)

### 🎨 Color Palettes

#### Light Mode (Default)
- Background: #F8FAFC (light gray)
- Navbar/Sidebar: #0F172A (navy)
- Cards: #FFFFFF (white)
- Text: #334155 (dark gray)
- Primary: #2563EB (blue)
- Success: #10B981 (green)
- Warning: #F59E0B (yellow)
- Danger: #EF4444 (red)

#### Dark Mode
- Background: #0F172A (dark navy)
- Navbar/Sidebar: #0F1B2E (darker navy)
- Cards: #1E293B (dark gray)
- Text: #E2E8F0 (light gray)
- Primary: #3B82F6 (light blue)
- Success: #10B981 (green - same)
- Warning: #F59E0B (yellow - same)
- Danger: #EF4444 (red - same)

### 🔧 Technical Implementation

#### theme.js (New File)
✅ `ThemeManager` class untuk handle theme logic
✅ Auto-detect system preference (prefers-color-scheme)
✅ localStorage persistence untuk user preference
✅ Smooth transition animations
✅ Global `toggleTheme()` function
✅ Responsive ke system theme changes

#### style.css Updates
✅ `:root` variables untuk light mode (default)
✅ `[data-theme="dark"]` selector untuk dark mode
✅ CSS variables untuk semua warna dan shadow
✅ Theme-specific styles untuk components
✅ Smooth transitions di semua elemen

#### HTML Updates
✅ Added `.theme-toggle` button di navbar semua pages
✅ Button styling dengan glassmorphic design
✅ `onclick="toggleTheme()"` handler
✅ `<script src="../js/theme.js"></script>` di semua pages

### 📋 Files Changed
- ✅ `frontend/css/style.css` - Added dark mode variables dan theme button
- ✅ `frontend/js/theme.js` - New file untuk theme management
- ✅ `frontend/html/index.html` - Added theme toggle button
- ✅ `frontend/html/login.html` - Added theme toggle button + navbar
- ✅ `frontend/html/register.html` - Added theme toggle button + navbar
- ✅ `frontend/html/mahasiswa.html` - Added theme toggle button
- ✅ `frontend/html/admin.html` - Added theme toggle button

### 🎯 Features

#### Automatic Theme Detection
- Sistem mengecek `prefers-color-scheme: dark` dari OS
- Jika user belum pernah set tema, ikuti system preference
- Jika user sudah set, gunakan preference yang disimpan

#### Smooth Transitions
- Semua perubahan warna dan style smooth berubah dalam 0.3s
- Tidak ada flash atau sudden change
- Professional dan pleasant user experience

#### Button Interactions
- Hover: Background lebih terang, scale up sedikit
- Active: Ripple animation yang spreads outward
- Focus: Proper focus state untuk accessibility

#### Persistent Storage
```javascript
localStorage.setItem('campusfix-theme', 'dark') // atau 'light'
```

### 🧪 Testing Checklist

- [ ] Buka website → Tema sesuai system preference
- [ ] Klik theme toggle → Tema berubah dengan animasi smooth
- [ ] Refresh page → Tema tetap sesuai pilihan sebelumnya
- [ ] Buka di dark mode system → Auto pakai dark mode
- [ ] Ubah system theme → Website otomatis ikut berubah (jika user belum override)
- [ ] Cek semua pages punya theme toggle button
- [ ] Cek dark mode → Semua text readable, contrast bagus
- [ ] Cek light mode → Professional appearance, clean design
- [ ] Hover theme button → Ada ripple effect yang smooth
- [ ] Check mobile → Button dan theme berfungsi di semua screen

### 🎨 Visual Improvements

1. **Dark Mode Benefits**:
   - 👁️ Eye-friendly untuk penggunaan malam
   - 🔋 Menghemat battery di OLED screens
   - 🎯 Professional appearance
   - ✨ Modern dan trendy

2. **Light Mode Benefits**:
   - 📖 Excellent readability di siang hari
   - 🎨 Clean dan professional design
   - 👥 Familiar untuk user baru

3. **Consistent Design**:
   - Semua pages support theme switching
   - Consistent color palette
   - Smooth transitions everywhere
   - Responsive di semua screen sizes

### 🚀 Performance

- Theme.js lightweight (~2KB)
- Minimal DOM repaints
- Efficient CSS variable usage
- Instant storage access
- No external dependencies

### 🔮 Future Enhancements

- [ ] Add theme preference UI di settings
- [ ] More theme options (blue, green, red themes)
- [ ] Theme scheduling (auto switch at sunset/sunrise)
- [ ] Export theme preferences

### 📝 Git Commit Message
```
feat(ui): add dark mode and light mode theme toggle

- Implement full theme system with automatic detection
- Add glassmorphic theme toggle button to all pages
- Create theme manager with localStorage persistence
- Support smooth transitions between themes
- All UI elements properly styled for both themes
- Mobile responsive theme switching
```

---

## 📝 Version 1.0.2 - Admin Dashboard Settings & Filter Enhancement

### ✨ Fitur Baru
✅ **Pengaturan Admin** - Page pengaturan yang fully functional dengan:
   - 👤 **Profil Admin** - Lihat info profil (nama, email, role)
   - 🔐 **Keamanan** - Change password functionality
   - ℹ️ **Informasi Sistem** - Versi, database, framework, status
   - 🔧 **Maintenance** - Backup data & clear cache
   - ℹ️ **Tentang** - About page dengan copyright

✅ **Smart Filter "Sedang Diproses"** - Menampilkan laporan dengan status:
   - "Pending" (Menunggu Verifikasi)
   - "Diproses" (Sedang Diproses)

### 🔧 Perubahan Teknis
- ✅ Update `filterReports()` untuk smart filtering
- ✅ Tambah `showSettings()` dan `backToReports()` functions
- ✅ Implementasi settings page sections
- ✅ Data export dan cache management

### 🎯 Fitur yang Sekarang Berfungsi
- Menu interaktivitas (semua 6 menu items berfungsi)
- Settings page dengan 5 subsections
- Smart filtering untuk "Sedang Diproses"
- Backup dan clear cache functionality

---

## 📝 Version 1.0.1 - Admin Dashboard Fix

### 🔧 Masalah yang Dilaporkan
Menu sidebar di dashboard admin tidak bisa diklik

### ✅ Solusi yang Diterapkan
- Added `onclick` handlers ke semua menu items
- Implementasi `filterReports()` function
- Update `updateActiveMenu()` untuk visual feedback
- Added smooth scroll behavior

---

**Last Updated:** June 2, 2026  
**Version:** 1.0.3 (Dark Mode & Light Mode Theme Toggle)
