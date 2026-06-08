class ChatbotWidget {
    constructor() {
        this.apiBaseUrl =
            typeof API_BASE_URL !== 'undefined'
                ? API_BASE_URL
                : 'http://127.0.0.1:8000/api';

        this.sessionId =
            localStorage.getItem('chatbot_session_id') ||
            this.generateSessionId();

        this.widget = null;
        this.container = null;
        this.floatingBtn = null;
        this.isSending = false;
        this.historyLoaded = false;
        this.scriptedResponses =
            this.createScriptedResponses();
    }

    init() {
        if (document.getElementById('chatbot-widget')) {
            return;
        }

        this.createFloatingButton();
        this.createWidget();
        this.attachEvents();
    }

    createFloatingButton() {
        const btn =
            document.createElement('button');

        btn.className =
            'chatbot-float-btn';

        btn.id =
            'chatbot-float-btn';

        btn.type =
            'button';

        btn.textContent =
            '?';

        document.body.appendChild(btn);

        this.floatingBtn = btn;
    }

    createWidget() {
        const widget =
            document.createElement('div');

        widget.className =
            'chatbot-widget-container minimized';

        widget.id =
            'chatbot-widget';

        widget.innerHTML = `
            <div class="chatbot-header">
                <div class="chatbot-header-title">
                    CampusFix Assistant
                </div>

                <div class="chatbot-header-actions">
                    <button
                        type="button"
                        class="chatbot-btn-close"
                        id="chatbot-close"
                        aria-label="Tutup chatbot">
                        x
                    </button>
                </div>
            </div>

            <div
                class="chatbot-messages"
                id="chatbot-messages">
                <div class="chatbot-empty-state">
                    <div class="chatbot-empty-state-text">
                        Halo! Ada yang bisa saya bantu?
                    </div>
                </div>
            </div>

            <div class="chatbot-input-area">
                <div class="chatbot-input-wrapper">
                    <input
                        type="text"
                        id="chatbot-input"
                        class="chatbot-input"
                        form="chatbot-detached-form"
                        autocomplete="off"
                        placeholder="Ketik pesan..." />

                    <button
                        type="button"
                        id="chatbot-send"
                        class="chatbot-send-btn"
                        aria-label="Kirim pesan">
                        &gt;
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(widget);

        this.widget = widget;
        this.container = widget;
        this.widget.style.display = 'none';
    }

    attachEvents() {
        this.widget.addEventListener(
            'submit',
            event => {
                event.preventDefault();
                event.stopPropagation();
            },
            true
        );

        this.widget.addEventListener(
            'click',
            event => {
                event.stopPropagation();
            }
        );

        document.addEventListener(
            'submit',
            event => {
                if (
                    this.widget.contains(event.target) ||
                    document.activeElement?.id === 'chatbot-input'
                ) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            },
            true
        );

        this.floatingBtn.addEventListener(
            'click',
            event => {
                event.preventDefault();
                event.stopPropagation();
                this.openWidget();
            }
        );

        document
            .getElementById('chatbot-close')
            .addEventListener(
                'click',
                event => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.closeWidget();
                }
            );

        document
            .getElementById('chatbot-send')
            .addEventListener(
                'click',
                event => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.sendMessage();
                }
            );

        const input =
            document.getElementById('chatbot-input');

        input.addEventListener(
            'keydown',
            event => {
                event.stopPropagation();

                if (event.key === 'Enter') {
                    event.preventDefault();
                    this.sendMessage();
                }
            },
            true
        );

        input.addEventListener(
            'keypress',
            event => {
                event.stopPropagation();
            },
            true
        );

        input.addEventListener(
            'keyup',
            event => {
                event.stopPropagation();
            },
            true
        );

        input.addEventListener(
            'input',
            event => {
                event.stopPropagation();
            },
            true
        );
    }

    openWidget() {
        this.widget.style.display = 'flex';
        this.widget.classList.remove('minimized');
        this.floatingBtn.style.display = 'none';

        const input =
            document.getElementById('chatbot-input');

        input.focus();
    }

    closeWidget() {
        this.widget.classList.add('minimized');
        this.widget.style.display = 'none';
        this.floatingBtn.style.display = 'flex';
    }

    async sendMessage() {
        const input =
            document.getElementById('chatbot-input');

        const message =
            input.value.trim();

        if (!message) {
            return;
        }

        if (this.isSending) {
            return;
        }

        this.isSending = true;
        input.value = '';

        this.addMessage(message, 'user');

        try {
            await this.wait(250);

            const botResponse =
                this.getScriptedResponse(message);

            this.addMessage(botResponse, 'bot');
            this.saveLocalChat(message, botResponse);
        } finally {
            this.isSending = false;
            input.focus();
        }
    }

    addMessage(text, sender) {
        const container =
            document.getElementById('chatbot-messages');

        const empty =
            container.querySelector('.chatbot-empty-state');

        if (empty) {
            empty.remove();
        }

        const message =
            document.createElement('div');

        message.className =
            `chatbot-message ${sender}`;

        const content =
            document.createElement('div');

        content.className =
            'chatbot-message-content';

        content.textContent =
            text;

        message.appendChild(content);
        container.appendChild(message);

        container.scrollTop =
            container.scrollHeight;
    }

    async loadHistory() {
        if (!this.sessionId) {
            return;
        }

        if (this.historyLoaded) {
            return;
        }

        const cacheKey =
            `chatbot_history_loaded_${this.sessionId}`;

        const lastLoaded =
            Number(sessionStorage.getItem(cacheKey) || 0);

        if (Date.now() - lastLoaded < 30000) {
            this.historyLoaded = true;
            return;
        }

        try {
            const url =
                `${this.apiBaseUrl}/chat/history?session_id=${encodeURIComponent(this.sessionId)}`;

            const response =
                await fetch(url);

            const data =
                await response.json();

            if (!response.ok || !data.success || !Array.isArray(data.chats)) {
                return;
            }

            sessionStorage.setItem(
                cacheKey,
                String(Date.now())
            );

            this.historyLoaded = true;

            data.chats.forEach(chat => {
                this.addMessage(chat.user_message, 'user');
                this.addMessage(chat.bot_response, 'bot');
            });
        } catch (err) {
            console.log('History tidak ditemukan');
        }
    }

    createScriptedResponses() {
        return [
            {
                keywords: ['halo', 'hai', 'hello', 'assalamualaikum', 'pagi', 'siang', 'sore', 'malam'],
                response:
                    'Halo! Selamat datang di CampusFix. Saya bisa bantu soal laporan fasilitas, status laporan, akun, login, register, upload foto, dan admin.'
            },
            {
                keywords: ['apa itu campusfix', 'campusfix itu apa', 'tentang campusfix', 'sistem apa'],
                response:
                    'CampusFix adalah website untuk melaporkan kerusakan fasilitas kampus. Mahasiswa bisa membuat laporan, melihat riwayat, dan memantau status perbaikan.'
            },
            {
                keywords: ['cara buat laporan', 'buat laporan', 'membuat laporan', 'kirim laporan', 'lapor kerusakan'],
                response:
                    'Cara membuat laporan: buka Dashboard Mahasiswa, isi lokasi fasilitas, kategori masalah, deskripsi detail, upload foto jika ada, lalu klik Kirim Laporan.'
            },
            {
                keywords: ['status laporan', 'cek laporan', 'riwayat laporan', 'laporan saya', 'progress laporan'],
                response:
                    'Status laporan bisa dilihat di bagian Riwayat Laporan Anda pada Dashboard Mahasiswa. Status umumnya Pending, Diproses, atau Selesai.'
            },
            {
                keywords: ['foto', 'upload foto', 'gambar', 'bukti', 'ukuran foto'],
                response:
                    'Upload foto bersifat opsional, tapi disarankan agar admin lebih mudah memahami kerusakan. Ukuran foto maksimal 5MB dan gunakan gambar yang jelas.'
            },
            {
                keywords: ['kategori', 'jenis masalah', 'contoh kategori'],
                response:
                    'Contoh kategori masalah: Kursi Rusak, Meja Rusak, Lampu Mati, AC Rusak, Kaca Pecah, Pintu Rusak, Atap Bocor, atau kategori lain sesuai masalah.'
            },
            {
                keywords: ['login', 'masuk', 'cara login'],
                response:
                    'Untuk login, buka halaman Masuk, isi email dan password yang sudah terdaftar, lalu klik tombol Masuk.'
            },
            {
                keywords: ['register', 'daftar', 'akun baru', 'buat akun'],
                response:
                    'Untuk daftar akun, buka halaman Daftar, isi nama lengkap, email, dan password, lalu klik Daftar Sekarang.'
            },
            {
                keywords: ['logout', 'keluar', 'log out'],
                response:
                    'Untuk logout, klik tombol Keluar di kanan atas halaman. Setelah itu akun akan keluar dari sistem.'
            },
            {
                keywords: ['admin', 'petugas', 'pengelola'],
                response:
                    'Admin bertugas melihat laporan mahasiswa, mengubah status laporan menjadi Diproses atau Selesai, dan mengelola data laporan.'
            },
            {
                keywords: ['password', 'lupa password', 'reset password'],
                response:
                    'Fitur reset password belum tersedia di halaman ini. Jika lupa password, silakan hubungi admin atau pengelola CampusFix.'
            },
            {
                keywords: ['kontak', 'hubungi', 'support', 'bantuan admin'],
                response:
                    'Jika kendala tidak bisa diselesaikan lewat chatbot, silakan hubungi admin kampus atau pengelola sistem CampusFix.'
            },
            {
                keywords: ['terima kasih', 'makasih', 'thanks', 'thank you'],
                response:
                    'Sama-sama! Semoga CampusFix membantu proses pelaporan fasilitas kampus jadi lebih mudah.'
            }
        ];
    }

    getScriptedResponse(message) {
        const normalizedMessage =
            this.normalizeMessage(message);

        let bestResponse = null;
        let bestScore = 0;

        this.scriptedResponses.forEach(item => {
            const score =
                item.keywords.reduce((total, keyword) => {
                    return normalizedMessage.includes(this.normalizeMessage(keyword))
                        ? total + 1
                        : total;
                }, 0);

            if (score > bestScore) {
                bestScore = score;
                bestResponse = item.response;
            }
        });

        if (bestResponse) {
            return bestResponse;
        }

        return 'Maaf, saya belum memahami pertanyaan itu. Coba tanyakan tentang cara buat laporan, status laporan, upload foto, login, daftar akun, atau admin.';
    }

    normalizeMessage(message) {
        return String(message)
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/\blapor\b/g, 'laporan')
            .replace(/\blapran\b/g, 'laporan')
            .replace(/\bgimana\b/g, 'cara')
            .replace(/\bgmna\b/g, 'cara')
            .replace(/\bcek\b/g, 'status');
    }

    saveLocalChat(userMessage, botResponse) {
        const key =
            `chatbot_local_history_${this.sessionId}`;

        const savedHistory =
            JSON.parse(localStorage.getItem(key) || '[]');

        savedHistory.push({
            user_message: userMessage,
            bot_response: botResponse,
            created_at: new Date().toISOString()
        });

        localStorage.setItem(
            key,
            JSON.stringify(savedHistory.slice(-20))
        );
    }

    wait(duration) {
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }

    generateSessionId() {
        const sessionId =
            `${Date.now()}-${Math.random().toString(36).substring(2)}`;

        localStorage.setItem(
            'chatbot_session_id',
            sessionId
        );

        return sessionId;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.chatbot =
        new ChatbotWidget();

    window.chatbot.init();
});
