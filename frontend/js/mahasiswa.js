const user =
    JSON.parse(localStorage.getItem('user'));

if (!user) {
    window.location.href =
        'login.html';
}

const REPORT_CACHE_TTL =
    30000;

const REPORT_CACHE_KEY =
    user ? `campusfix_all_reports_${user.id}` : null;

const REPORT_CACHE_TIME_KEY =
    user ? `campusfix_all_reports_time_${user.id}` : null;

const REPORT_STATUS_CACHE_KEY =
    user ? `campusfix_report_status_${user.id}` : null;

document.addEventListener('DOMContentLoaded', () => {
    if (!user) {
        return;
    }

    const userInfo =
        document.getElementById('userInfo');

    if (userInfo) {
        userInfo.innerHTML = `
            <span>Mahasiswa</span>
            <strong>${escapeHtml(user.name)}</strong>
            <i></i>
        `;
    }

    loadReports();
});

async function submitReport() {
    const location =
        document.getElementById('location').value.trim();

    const category =
        document.getElementById('category').value.trim();

    const description =
        document.getElementById('description').value.trim();

    if (!location || !category || !description) {
        alert('Semua field wajib diisi!');
        return;
    }

    const photo =
        document.getElementById('photo').files[0];

    const formData =
        new FormData();

    formData.append('user_id', user.id);
    formData.append('location', location);
    formData.append('category', category);
    formData.append('description', description);

    if (photo) {
        if (photo.size > 5 * 1024 * 1024) {
            alert('Ukuran foto maksimal 5MB');
            return;
        }

        formData.append('photo', photo);
    }

    try {
        const response =
            await fetch(
                `${API_BASE_URL}/reports`,
                {
                    method: 'POST',
                    body: formData
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                getErrorMessage(data) ||
                'Gagal mengirim laporan'
            );
        }

        alert(
            data.message ||
            'Laporan berhasil dikirim'
        );

        document.getElementById('location').value = '';
        document.getElementById('category').value = '';
        document.getElementById('description').value = '';
        document.getElementById('photo').value = '';

        clearReportsCache();
        closeReportForm();
        loadReports(true);
    } catch (err) {
        console.error(err);
        alert(err.message || 'Gagal mengirim laporan');
    }
}

function getCachedReports() {
    if (!REPORT_CACHE_KEY || !REPORT_CACHE_TIME_KEY) {
        return null;
    }

    const cacheTime =
        Number(sessionStorage.getItem(REPORT_CACHE_TIME_KEY) || 0);

    if (Date.now() - cacheTime > REPORT_CACHE_TTL) {
        return null;
    }

    const cachedReports =
        sessionStorage.getItem(REPORT_CACHE_KEY);

    if (!cachedReports) {
        return null;
    }

    try {
        return JSON.parse(cachedReports);
    } catch (err) {
        clearReportsCache();
        return null;
    }
}

function setCachedReports(reports) {
    if (!REPORT_CACHE_KEY || !REPORT_CACHE_TIME_KEY) {
        return;
    }

    sessionStorage.setItem(
        REPORT_CACHE_KEY,
        JSON.stringify(reports)
    );

    sessionStorage.setItem(
        REPORT_CACHE_TIME_KEY,
        String(Date.now())
    );
}

function clearReportsCache() {
    if (!REPORT_CACHE_KEY || !REPORT_CACHE_TIME_KEY) {
        return;
    }

    sessionStorage.removeItem(REPORT_CACHE_KEY);
    sessionStorage.removeItem(REPORT_CACHE_TIME_KEY);
}

async function loadReports(forceRefresh = false) {
    const cachedReports =
        forceRefresh ? null : getCachedReports();

    if (cachedReports) {
        showStudentNotifications(cachedReports);
        renderOwnTimeline(cachedReports);
        renderReports(cachedReports);
        return;
    }

    try {
        const response =
            await fetch(
                `${API_BASE_URL}/reports`
            );

        const reports =
            await response.json();

        setCachedReports(reports);
        showStudentNotifications(reports);
        renderOwnTimeline(reports);
        renderReports(reports);
    } catch (err) {
        console.error(err);
        alert('Gagal mengambil laporan');
    }
}

function renderOwnTimeline(reports) {
    const timelineList =
        document.getElementById('ownTimelineList');

    const timelineEmpty =
        document.getElementById('ownTimelineEmpty');

    if (!timelineList) {
        return;
    }

    const ownReports = Array.isArray(reports)
        ? reports.filter(report => Number(report.user_id) === Number(user.id))
        : [];

    if (ownReports.length === 0) {
        timelineList.innerHTML = '';

        if (timelineEmpty) {
            timelineEmpty.style.display = 'block';
        }

        return;
    }

    if (timelineEmpty) {
        timelineEmpty.style.display = 'none';
    }

    timelineList.innerHTML = ownReports.map(report => {
        const status = report.status || 'Menunggu Verifikasi';
        const statusStyle = getStudentStatusStyle(status);

        return `
            <article class="student-timeline-item">
                <div class="timeline-marker ${statusStyle.marker}"></div>
                <div class="student-timeline-content">
                    <div class="student-timeline-top">
                        <strong>${escapeHtml(statusStyle.title)}</strong>
                        <span>${escapeHtml(formatRelativeDate(report.created_at))}</span>
                    </div>
                    <h3>${escapeHtml(report.category)}</h3>
                    <p>${escapeHtml(report.description)}</p>
                    <div class="student-timeline-meta">
                        <span>Lokasi: ${escapeHtml(report.location)}</span>
                        <span>Dikirim: ${escapeHtml(formatDate(report.created_at))}</span>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

function renderReports(reports) {
    const reportList =
        document.getElementById('reportList');

    const emptyState =
        document.getElementById('emptyState');

    if (!reportList) {
        return;
    }

    if (!Array.isArray(reports) || reports.length === 0) {
        reportList.innerHTML = '';

        if (emptyState) {
            emptyState.style.display =
                'block';
        }

        return;
    }

    if (emptyState) {
        emptyState.style.display =
            'none';
    }

    reportList.innerHTML =
        reports.map(report => {
            const status =
                report.status || 'Pending';

            let statusColor =
                'bg-warning';

            let statusIcon =
                '...';

            if (status === 'Diproses') {
                statusColor =
                    'bg-primary';
                statusIcon =
                    '*';
            }

            if (status === 'Selesai') {
                statusColor =
                    'bg-success';
                statusIcon =
                    'OK';
            }

            const photoUrl =
                getReportPhotoUrl(report);

            const photoHtml =
                photoUrl
                    ? `
                        <img
                            src="${escapeHtml(photoUrl)}"
                            class="report-image"
                            alt="Foto laporan">
                    `
                    : '';

            const isOwnReport =
                Number(report.user_id) === Number(user.id);

            const likedBy =
                Array.isArray(report.liked_by) ? report.liked_by : [];

            const isLiked =
                likedBy.map(Number).includes(Number(user.id));

            const reporterName =
                report.user?.name || 'Mahasiswa';

            const sentDate =
                formatDate(report.created_at);

            return `
                <div class="report-item student-report-card">
                    <div class="report-header">
                        <div>
                            <div class="report-title">
                                ${escapeHtml(report.category)}
                            </div>
                            <div class="report-subtitle">
                                Dikirim oleh ${escapeHtml(reporterName)} pada ${escapeHtml(sentDate)}
                                ${isOwnReport ? '<span class="mini-badge">Laporan Anda</span>' : ''}
                            </div>
                        </div>

                        <span class="badge ${statusColor}">
                            ${statusIcon}
                            ${escapeHtml(status)}
                        </span>
                    </div>

                    <div class="report-meta">
                        <div class="report-meta-item">
                            <strong>Lokasi:</strong>
                            <span>${escapeHtml(report.location)}</span>
                        </div>

                        <div class="report-meta-item">
                            <strong>Deskripsi:</strong>
                            <span>${escapeHtml(report.description)}</span>
                        </div>
                    </div>

                    ${photoHtml}

                    <div class="report-actions">
                        <button
                            type="button"
                            class="btn ${isLiked ? 'btn-success' : 'btn-primary'} btn-sm"
                            onclick="toggleLike(${report.id})">
                            ${isLiked ? 'Sudah Like' : 'Like Laporan'}
                        </button>
                        <span class="like-count">
                            ${Number(report.likes_count || 0)} mahasiswa merasa laporan ini berdampak
                        </span>
                    </div>
                </div>
            `;
        }).join('');
}

function openReportForm() {
    const overlay =
        document.getElementById('reportFormOverlay');

    if (!overlay) {
        return;
    }

    overlay.style.display = 'flex';

    const locationInput =
        document.getElementById('location');

    if (locationInput) {
        locationInput.focus();
    }
}

function closeReportForm() {
    const overlay =
        document.getElementById('reportFormOverlay');

    if (!overlay) {
        return;
    }

    overlay.style.display = 'none';
}

function focusStudentNotification() {
    const notification =
        document.getElementById('studentNotification');

    if (notification) {
        notification.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

async function toggleLike(reportId) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/reports/${reportId}/like`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user.id
                })
            }
        );

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(
                getErrorMessage(data) ||
                'Gagal memberi like laporan'
            );
        }

        clearReportsCache();
        loadReports(true);
    } catch (err) {
        console.error(err);
        alert(err.message || 'Gagal memberi like laporan');
    }
}

function logout() {
    const yakin =
        confirm('Yakin ingin keluar?');

    if (!yakin) {
        return;
    }

    localStorage.removeItem('user');

    window.location.href =
        'login.html';
}

function showStudentNotifications(reports) {
    if (!REPORT_STATUS_CACHE_KEY || !Array.isArray(reports)) {
        return;
    }

    const ownReports = reports.filter(
        report => Number(report.user_id) === Number(user.id)
    );

    let previousStatuses = {};

    try {
        previousStatuses = JSON.parse(
            localStorage.getItem(REPORT_STATUS_CACHE_KEY) || '{}'
        );
    } catch (err) {
        previousStatuses = {};
    }

    const currentStatuses = {};
    const changedReports = [];
    const activeReports = [];

    ownReports.forEach(report => {
        currentStatuses[report.id] = report.status;

        if (
            previousStatuses[report.id] &&
            previousStatuses[report.id] !== report.status
        ) {
            changedReports.push(report);
        }

        if (report.status === 'Diproses' || report.status === 'Selesai') {
            activeReports.push(report);
        }
    });

    localStorage.setItem(
        REPORT_STATUS_CACHE_KEY,
        JSON.stringify(currentStatuses)
    );

    const notification =
        document.getElementById('studentNotification');

    if (!notification) {
        return;
    }

    if (changedReports.length === 0 && activeReports.length === 0) {
        notification.style.display = 'none';
        notification.innerHTML = '';
        updateStudentNotificationBadge(false);
        return;
    }

    const changedHtml = changedReports.length > 0
        ? changedReports.map(report => (
            `${escapeHtml(report.category)} sekarang berstatus ${escapeHtml(report.status)}`
        )).join('<br>')
        : '';

    const activeHtml = activeReports.length > 0
        ? activeReports.slice(0, 3).map(report => (
            `${escapeHtml(report.category)}: ${escapeHtml(report.status)}`
        )).join('<br>')
        : '';

    notification.style.display = 'block';
    updateStudentNotificationBadge(true);
    notification.innerHTML = `
        <strong>Notifikasi laporan</strong>
        <p>
            ${changedHtml}
            ${changedHtml && activeHtml ? '<br>' : ''}
            ${activeHtml ? `Status laporan Anda:<br>${activeHtml}` : ''}
        </p>
    `;
}

function updateStudentNotificationBadge(hasNotification) {
    const badge =
        document.getElementById('studentNotificationBadge');

    if (!badge) {
        return;
    }

    badge.style.display = hasNotification ? 'inline-flex' : 'none';
}

function getStudentStatusStyle(status) {
    if (status === 'Diproses') {
        return {
            marker: 'is-processing',
            title: 'Laporan sedang diproses'
        };
    }

    if (status === 'Selesai') {
        return {
            marker: 'is-done',
            title: 'Laporan selesai ditangani'
        };
    }

    return {
        marker: 'is-new',
        title: 'Laporan pengaduan baru'
    };
}

function formatRelativeDate(value) {
    if (!value) {
        return '-';
    }

    const diffMs = Date.now() - new Date(value).getTime();
    const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

    if (diffMinutes < 60) {
        return `${diffMinutes} menit lalu`;
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
        return `${diffHours} jam lalu`;
    }

    const diffDays = Math.floor(diffHours / 24);

    return `${diffDays} hari lalu`;
}

function formatDate(value) {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(value));
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getReportPhotoUrl(report) {
    if (report.photo_url) {
        return report.photo_url;
    }

    if (!report.photo) {
        return '';
    }

    if (/^https?:\/\//i.test(report.photo)) {
        return report.photo;
    }

    return `${UPLOAD_BASE_URL}/${encodeURIComponent(report.photo)}`;
}

function getErrorMessage(data) {
    if (!data) {
        return '';
    }

    if (data.message) {
        return data.message;
    }

    if (data.errors) {
        return Object.values(data.errors)
            .flat()
            .join('\n');
    }

    return '';
}
