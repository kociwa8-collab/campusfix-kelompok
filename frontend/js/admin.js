const user = JSON.parse(localStorage.getItem('user'));

if (!user || user.role !== 'admin') {
    alert('Akses ditolak!');
    window.location.href = 'login.html';
}

let currentFilter = 'all';
let currentSearch = '';
let allReports = [];

const ADMIN_LAST_REPORT_KEY = 'campusfix_admin_last_report_id';

document.addEventListener('DOMContentLoaded', () => {
    const userInfo = document.getElementById('userInfo');

    if (userInfo) {
        userInfo.innerHTML = `
            <span>Admin</span>
            <strong>${escapeHtml(user.name)}</strong>
            <i></i>
        `;
    }

    initAdminFilters();
});

function updateActiveMenu(filterStatus) {
    document.querySelectorAll('.sidebar-menu-item').forEach(item => {
        item.classList.remove('active');
    });

    const menuMap = {
        dashboard: ['menuDashboard'],
        all: ['menuAll'],
        'Menunggu Verifikasi': ['menuPending'],
        Diproses: ['menuProcessing'],
        Selesai: ['menuCompleted'],
        settings: ['menuSettings']
    };

    (menuMap[filterStatus] || []).forEach(id => {
        const menu = document.getElementById(id);
        if (menu) {
            menu.classList.add('active');
        }
    });
}

function showDashboard() {
    currentFilter = 'all';

    const statusFilter = document.getElementById('adminStatusFilter');

    if (statusFilter) {
        statusFilter.value = 'all';
    }

    showReportsView();
    updateActiveMenu('dashboard');
    applyReportFilters();

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function filterReports(status) {
    currentFilter = status;
    showReportsView();

    const statusFilter = document.getElementById('adminStatusFilter');
    if (statusFilter) {
        statusFilter.value = status;
    }

    updateActiveMenu(status);
    applyReportFilters();

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function applyReportFilters() {
    const keyword = currentSearch.toLowerCase();

    const filteredReports = allReports.filter(report => {
        const matchStatus =
            currentFilter === 'all' ||
            report.status === currentFilter;

        const searchableText = [
            report.category,
            report.location,
            report.description,
            report.status,
            report.user?.name
        ].join(' ').toLowerCase();

        const matchSearch =
            !keyword ||
            searchableText.includes(keyword);

        return matchStatus && matchSearch;
    });

    displayReports(filteredReports);
}

function initAdminFilters() {
    const searchInput = document.getElementById('adminSearchInput');
    const statusFilter = document.getElementById('adminStatusFilter');

    if (searchInput) {
        searchInput.addEventListener('input', event => {
            currentSearch = event.target.value.trim();
            applyReportFilters();
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', event => {
            currentFilter = event.target.value || 'all';
            updateActiveMenu(currentFilter);
            applyReportFilters();
        });
    }
}

function displayReports(reports) {
    let html = '';
    const emptyState = document.getElementById('emptyState');
    const reportList = document.getElementById('reportList');
    const reportItems = Array.isArray(reports) ? reports : [];

    if (!reportList) {
        return;
    }

    if (reportItems.length === 0) {
        if (emptyState) {
            emptyState.style.display = 'block';
            emptyState.innerHTML = currentFilter === 'all'
                ? `
                    <div class="empty-state-icon">!</div>
                    <h3>Belum ada laporan</h3>
                    <p>Semua laporan mahasiswa akan muncul di sini.</p>
                `
                : `
                    <div class="empty-state-icon">-</div>
                    <h3>Tidak ada laporan dengan status ini</h3>
                    <p>Coba filter ke status lain atau lihat semua laporan.</p>
                `;
        }
    } else if (emptyState) {
        emptyState.style.display = 'none';
    }

    reportItems.forEach(report => {
        const statusStyle = getStatusStyle(report.status);
        const reporterName = report.user?.name || 'Mahasiswa';
        const sentDate = formatDate(report.created_at);
        const likesCount = Number(report.likes_count || 0);

        html += `
            <div class="report-item">
                <div class="report-header">
                    <div>
                        <div class="report-title">${escapeHtml(report.category)}</div>
                        <div class="report-subtitle">
                            Dikirim oleh ${escapeHtml(reporterName)} pada ${escapeHtml(sentDate)}
                        </div>
                    </div>
                    <span class="badge ${statusStyle.color}">
                        ${statusStyle.label} - ${escapeHtml(report.status)}
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
                    <div class="report-meta-item">
                        <strong>Dampak:</strong>
                        <span>${likesCount} like dari mahasiswa</span>
                    </div>
                </div>

                ${report.photo ? `
                    <div style="margin-top: 16px;">
                        <img
                            src="${UPLOAD_BASE_URL}/${encodeURIComponent(report.photo)}"
                            class="report-image"
                            alt="Foto laporan"
                            onclick="openImage(this.src)"
                        >
                    </div>
                ` : ''}

                <div class="report-actions">
                    <button
                        type="button"
                        class="btn btn-primary btn-sm"
                        onclick="updateStatus(${report.id}, 'Diproses')">
                        Mulai Proses
                    </button>

                    <button
                        type="button"
                        class="btn btn-success btn-sm"
                        onclick="updateStatus(${report.id}, 'Selesai')">
                        Tandai Selesai
                    </button>
                </div>
            </div>
        `;
    });

    reportList.innerHTML = html;
}

async function loadReports() {
    try {
        const response = await fetch(`${API_BASE_URL}/reports`);

        if (!response.ok) {
            throw new Error('Gagal mengambil laporan');
        }

        const data = await response.json();
        allReports = normalizeReportsResponse(data);
        showAdminNotifications(allReports);
        updateReportStats();
        applyReportFilters();
    } catch (err) {
        console.error(err);
        alert('Tidak dapat mengambil data laporan');
    }
}

async function updateStatus(id, status) {
    try {
        const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            const data = await response.json().catch(() => null);
            throw new Error(
                getErrorMessage(data) ||
                'Gagal mengubah status laporan'
            );
        }
    } catch (err) {
        console.error(err);
        alert(err.message || 'Gagal mengubah status laporan');
        return;
    }

    loadReports();
}

function normalizeReportsResponse(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.reports)) {
        return data.reports;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    return [];
}

function updateReportStats() {
    const totalReport = document.getElementById('totalReport');
    const processReport = document.getElementById('processReport');
    const doneReport = document.getElementById('doneReport');

    if (totalReport) {
        totalReport.textContent = allReports.length;
    }

    if (processReport) {
        processReport.textContent = allReports.filter(
            report => report.status === 'Diproses'
        ).length;
    }

    if (doneReport) {
        doneReport.textContent = allReports.filter(
            report => report.status === 'Selesai'
        ).length;
    }
}

function showAdminNotifications(reports) {
    const notification = document.getElementById('adminNotification');

    if (!notification || !Array.isArray(reports) || reports.length === 0) {
        if (notification) {
            notification.style.display = 'none';
            notification.innerHTML = '';
        }

        updateAdminNotificationBadge(false);

        return;
    }

    const latestReportId = Math.max(...reports.map(report => Number(report.id || 0)));
    const previousReportId = Number(localStorage.getItem(ADMIN_LAST_REPORT_KEY) || 0);
    const newReports = previousReportId
        ? reports.filter(report => Number(report.id) > previousReportId)
        : [];
    const pendingReports = reports.filter(
        report => report.status === 'Menunggu Verifikasi'
    );

    localStorage.setItem(ADMIN_LAST_REPORT_KEY, String(latestReportId));

    if (newReports.length === 0 && pendingReports.length === 0) {
        notification.style.display = 'none';
        notification.innerHTML = '';
        updateAdminNotificationBadge(false);
        return;
    }

    const latestPending = pendingReports[0] || newReports[0];
    const newReportText = newReports.length > 0
        ? `Ada ${newReports.length} laporan baru masuk.`
        : 'Tidak ada laporan baru sejak kunjungan terakhir.';
    const pendingText = pendingReports.length > 0
        ? `${pendingReports.length} laporan masih menunggu verifikasi admin.`
        : 'Semua laporan sudah melewati tahap verifikasi awal.';

    notification.style.display = 'block';
    updateAdminNotificationBadge(true);
    notification.innerHTML = `
        <strong>Notifikasi laporan masuk</strong>
        <p>
            ${escapeHtml(newReportText)}
            ${escapeHtml(pendingText)}
            ${latestPending ? `
                <br>Terbaru: ${escapeHtml(latestPending.category)}
                dari ${escapeHtml(latestPending.user?.name || 'Mahasiswa')}.
            ` : ''}
        </p>
    `;
}

function updateAdminNotificationBadge(hasNotification) {
    const badge = document.getElementById('adminNotificationBadge');

    if (!badge) {
        return;
    }

    badge.style.display = hasNotification ? 'inline-flex' : 'none';
}

function focusAdminNotification() {
    const notification = document.getElementById('adminNotification');

    if (notification) {
        notification.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

function logout() {
    const yakin = confirm('Yakin ingin keluar?');

    if (!yakin) {
        return;
    }

    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

function openImage(src) {
    document.getElementById('imageModal')
        .classList.add('open');

    document.getElementById('modalImage')
        .src = src;
}

function closeImage() {
    document.getElementById('imageModal')
        .classList.remove('open');
}

function showSettings() {
    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('searchFilterBar').style.display = 'none';
    document.getElementById('reportsSection').style.display = 'none';
    document.getElementById('reportList').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('settingsSection').style.display = 'grid';

    document.getElementById('adminName').value = user.name;
    document.getElementById('adminEmail').value = user.email;

    updateActiveMenu('settings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToReports() {
    showReportsView();
    applyReportFilters();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showReportsView() {
    document.getElementById('settingsSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'grid';
    document.getElementById('searchFilterBar').style.display = 'flex';
    document.getElementById('reportsSection').style.display = 'block';
    document.getElementById('reportList').style.display = 'grid';
    document.getElementById('emptyState').style.display = 'none';
}

function changePassword() {
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!oldPassword || !newPassword || !confirmPassword) {
        alert('Semua field harus diisi');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('Password baru tidak cocok dengan konfirmasi');
        return;
    }

    if (newPassword.length < 6) {
        alert('Password baru minimal 6 karakter');
        return;
    }

    alert('Password berhasil diubah!');
    document.getElementById('oldPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

function backupData() {
    const timestamp = new Date().toISOString().split('T')[0];
    const backupData = {
        timestamp: new Date().toISOString(),
        totalReports: allReports.length,
        reports: allReports,
        exportedBy: user.email
    };

    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `campusfix-backup-${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert('Backup data berhasil diunduh!');
}

function clearCache() {
    if (confirm('Apakah Anda yakin ingin menghapus cache?')) {
        localStorage.clear();
        sessionStorage.clear();
        alert('Cache berhasil dihapus.');
    }
}

function getStatusStyle(status) {
    if (status === 'Diproses') {
        return {
            color: 'bg-primary',
            label: 'Proses'
        };
    }

    if (status === 'Selesai') {
        return {
            color: 'bg-success',
            label: 'Selesai'
        };
    }

    return {
        color: 'bg-warning',
        label: 'Menunggu'
    };
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

loadReports();
