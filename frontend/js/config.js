const LOCAL_API_BASE_URL =
    'http://127.0.0.1:8000/api';

const PRODUCTION_API_BASE_URL =
    'https://campusfix-kelompok-api.onrender.com/api';

const API_BASE_URL =
    window.CAMPUSFIX_API_BASE_URL ||
    localStorage.getItem('CAMPUSFIX_API_BASE_URL') ||
    (
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === 'localhost' ||
        window.location.protocol === 'file:'
            ? LOCAL_API_BASE_URL
            : PRODUCTION_API_BASE_URL
    );

const UPLOAD_BASE_URL =
    API_BASE_URL.replace(/\/api\/?$/, '/uploads');
