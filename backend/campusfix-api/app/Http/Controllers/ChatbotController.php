<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ChatbotController extends Controller
{
    /**
     * Frequently asked questions database
     */
    private $faqDatabase = [
        'general' => [
            [
                'keywords' => ['halo', 'hai', 'assalamu', 'pagi', 'siang', 'malam'],
                'response' => 'Halo! 👋 Selamat datang di CampusFix. Saya siap membantu Anda. Apa yang bisa saya bantu?'
            ],
            [
                'keywords' => ['bantuan', 'help', 'bagaimana', 'caranya'],
                'response' => 'Saya siap membantu! Berikut topik yang bisa saya bantu:\n• 📋 Cara membuat laporan\n• 👤 Bantuan akun\n• 🔍 Pantau status laporan\n• ❓ Pertanyaan umum\n\nSilakan tanyakan topik mana yang ingin Anda tahu lebih lanjut.'
            ],
            [
                'keywords' => ['apa itu', 'campusfix', 'sistem'],
                'response' => 'CampusFix adalah platform pelaporan fasilitas kampus yang mudah digunakan. Dengan CampusFix, Anda dapat:\n✅ Melaporkan kerusakan fasilitas kampus\n✅ Memantau status perbaikan secara real-time\n✅ Berkomunikasi dengan tim perbaikan\n✅ Melihat riwayat laporan Anda\n\nAda yang ingin ditanyakan lebih lanjut?'
            ],
            [
                'keywords' => ['siapa yang membuat','pengembang','developer','campusfix dibuat oleh siapa'],
                 'response' => '🏫 CampusFix dikembangkan sebagai sistem pelaporan fasilitas kampus yang membantu mahasiswa melaporkan kerusakan dan memantau proses perbaikannya secara lebih mudah dan transparan. 🏫 CampusFix dikembangkan sebagai sistem pelaporan fasilitas kampus yang membantu mahasiswa melaporkan kerusakan dan memantau proses perbaikannya secara lebih mudah dan transparan.'
            ],
            [
                'keywords' => ['kontak','hubungi admin','bantuan admin','support'],
                'response' => '📞 Jika mengalami kendala yang tidak dapat diselesaikan melalui chatbot, silakan hubungi admin kampus atau pengelola sistem CampusFix.'
            ]
            
        ],
        'report' => [
            [
                'keywords' => ['laporan', 'cara membuat', 'buat laporan', 'submit'],
                'response' => '📝 Berikut cara membuat laporan di CampusFix:\n\n1️⃣ Klik tombol "Buat Laporan Baru"\n2️⃣ Isi lokasi fasilitas (contoh: Gedung A, Ruang 101)\n3️⃣ Pilih kategori masalah (contoh: Kerusakan Kaca, Kursi Rusak)\n4️⃣ Jelaskan masalah secara detail\n5️⃣ (Opsional) Upload foto bukti\n6️⃣ Klik "Kirim Laporan"\n\nLaporan Anda akan langsung masuk ke antrian perbaikan!\n\nAda yang kurang jelas?'
            ],
            [
                'keywords' => ['status', 'laporan saya', 'riwayat', 'cek'],
                'response' => '📊 Untuk melihat status laporan Anda:\n\n1. Buka halaman Dashboard Mahasiswa\n2. Scroll ke bagian "Riwayat Laporan Anda"\n3. Di sana Anda bisa melihat:\n   • Status laporan (Menunggu, Diproses, Selesai)\n   • Detail masalah yang dilaporkan\n   • Tanggal laporan dibuat\n\nStatus akan diperbarui secara real-time ketika tim perbaikan menangani laporan Anda.\n\nAda pertanyaan lain?'
            ],
            [
                'keywords' => ['foto', 'upload', 'gambar', 'bukti'],
                'response' => '📸 Tentang upload foto bukti:\n\n✅ Foto BOLEH di-upload tapi OPSIONAL\n✅ Format yang didukung: JPG, PNG\n✅ Ukuran maksimal: 5MB\n✅ Gunakan foto yang jelas untuk memudahkan tim perbaikan\n\nFoto membantu tim perbaikan memahami masalah dengan lebih baik. Disarankan untuk mengupload foto jika memungkinkan!\n\nBisanya ukuran foto di atas limit? Coba kompres terlebih dahulu.'
            ],
            [
                'keywords' => ['kategori', 'jenis masalah'],
                'response' => '🏷️ Kategori masalah yang umum dilaporkan:\n\n• Kerusakan Kaca/Jendela\n• Kursi/Meja Rusak\n• Lampu Tidak Nyala\n• AC Tidak Berfungsi\n• Atap Bocor\n• Kloset Rusak\n• Pintu Rusak\n• Lainnya (sesuai kebutuhan)\n\nJika masalah Anda tidak sesuai kategori di atas, silakan tulis kategori sendiri di form laporan.'
            ],
            [
                'keywords' => ['diproses','kapan selesai','progress','tracking','verifikasi'],
                'response' => '📌 Status laporan memiliki 3 tahapan:⏳ Menunggu Verifikasi,⚙️ Diproses,✅ Selesai. Admin akan memperbarui status secara berkala setelah laporan diperiksa.'
            ]
        ],
        'account' => [
            [
                'keywords' => ['login', 'masuk', 'password', 'lupa'],
                'response' => '🔐 Panduan Login:\n\n1. Klik tombol "Masuk" di halaman utama\n2. Masukkan email yang didaftarkan\n3. Masukkan password Anda\n4. Klik "Masuk"\n\n❌ Lupa Password?\n• Fitur reset password sedang dalam pengembangan\n• Hubungi admin untuk bantuan reset password\n\nAda masalah lain?'
            ],
            [
                'keywords' => ['register', 'daftar', 'akun baru'],
                'response' => '📝 Cara Mendaftar Akun Baru:\n\n1. Klik tombol "Daftar" di halaman login\n2. Isi data berikut:\n   • Nama lengkap\n   • Email (gunakan email aktif)\n   • Password (minimal 8 karakter)\n   • Konfirmasi password\n3. Klik "Daftar"\n4. Akun Anda siap digunakan!\n\n💡 Tips:\n• Gunakan email yang mudah diingat\n• Buat password yang kuat\n• Jangan share password dengan orang lain\n\nSudah berhasil daftar?'
            ],
            [
                'keywords' => ['logout', 'keluar', 'log out'],
                'response' => '👋 Cara Logout/Keluar:\n\n1. Klik tombol "Keluar" di pojok kanan atas navbar\n2. Anda akan diminta konfirmasi\n3. Klik "Ya" untuk keluar\n4. Anda akan dialihkan ke halaman login\n\n⚠️ Penting: Selalu logout jika menggunakan komputer umum untuk menjaga keamanan akun Anda!\n\nAda yang lain?'
            ],
            [
                'keywords' => ['admin','petugas','pengelola'],
                'response' => '👨‍💼 Admin bertugas memverifikasi laporan mahasiswa, mengubah status laporan, dan memantau seluruh kerusakan fasilitas kampus.'
            ],
            [
                'keywords' => ['aman','keamanan','password saya'],
                'response' => '🔐 Password pengguna disimpan secara terenkripsi (hashed) sehingga tidak dapat dibaca langsung oleh sistem maupun pengguna lain.'
            ]
        ]
    ];

    /**
     * Send message to chatbot
     */
    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
            'session_id' => 'nullable|string',
        ]);

        $userMessage = $validated['message'];
        $sessionId = $validated['session_id'] ?? Str::uuid();
       $userId = null;

        if (
            auth()->check()
        ) {

        $userId =
        auth()->id();
        } 

        // Find best matching response
        $response = $this->findBestResponse($userMessage);

        // Save to database
        $chat = Chat::create([
            'user_id' => $userId,
            'session_id' => $sessionId,
            'user_message' => $userMessage,
            'bot_response' => $response['message'],
            'category' => $response['category'],
        ]);

        return response()->json([
            'success' => true,
            'session_id' => $sessionId,
            'chat_id' => $chat->id,
            'message' => $response['message'],
            'category' => $response['category'],
            'timestamp' => $chat->created_at
        ]);
    }

    /**
     * Get chat history
     */
    public function getChatHistory(Request $request)
    {
        $sessionId = $request->query('session_id');

        $chats = Chat::where('session_id', $sessionId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'chats' => $chats
        ]);
    }

    /**
     * Rate chatbot response
     */
    public function rateResponse(Request $request, $chatId)
    {
        $validated = $request->validate([
            'helpfulness' => 'required|in:0,1'
        ]);

        $chat = Chat::findOrFail($chatId);
        $chat->update(['helpfulness' => $validated['helpfulness']]);

        return response()->json([
            'success' => true,
            'message' => 'Terima kasih atas feedback Anda!'
        ]);
    }

    /**
     * Find best matching response using keyword matching
     */
    private function findBestResponse($userMessage)
    {
        $userMessage = $this->normalizeText($userMessage);
        $bestMatch = null;
        $bestScore = 0;

        // Search through all categories
        foreach ($this->faqDatabase as $category => $faqs) {
            foreach ($faqs as $faq) {
                $score = 0;
                foreach ($faq['keywords'] as $keyword) {
                    if (strpos($userMessage, $keyword) !== false) {
                        $score++;
                    }
                }

                if ($score > $bestScore) {
                    $bestScore = $score;
                    $bestMatch = [
                        'message' => $faq['response'],
                        'category' => $category
                    ];
                }
            }
        }

        // Default response if no match found
        if (!$bestMatch) {
            $bestMatch = [
                'message' => 'Maaf, saya belum memahami pertanyaan Anda. 😅\n\nSilakan coba:\n• Rephrase pertanyaan Anda\n• Tanya tentang: laporan, akun, status, atau cara membuat laporan\n\nAtau hubungi admin jika membutuhkan bantuan lebih lanjut.',
                'category' => 'general'
            ];
        }

        return $bestMatch;
    }

    private function normalizeText($text)
{
    $text = strtolower($text);

    $replace = [

        'lapran' => 'laporan',
        'lapor' => 'laporan',
        'pengaduan' => 'laporan',

        'gimana' => 'bagaimana',
        'gmna' => 'bagaimana',

        'akunku' => 'akun',

        'fotoo' => 'foto',

        'status laporan saya' => 'status',

        'progress' => 'status',

        'tracking' => 'status'
    ];

    foreach ($replace as $old => $new) {

        $text = str_replace(
            $old,
            $new,
            $text
        );
    }

    return $text;
}

    /**
     * Get FAQ list
     */
    public function getFaqList()
    {
        $faqs = [];
        foreach ($this->faqDatabase as $category => $items) {
            $faqs[$category] = count($items);
        }

        return response()->json([
            'success' => true,
            'faqs' => $this->faqDatabase
        ]);
    }
}
