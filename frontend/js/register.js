async function register() {

    const name =
        document.getElementById('name').value.trim();

    const email =
        document.getElementById('email').value.trim();

    const password =
        document.getElementById('password').value.trim();

    if (!name || !email || !password) {

        alert(
            'Semua field wajib diisi'
        );

        return;
    }

    if (password.length < 6) {

        alert(
            'Password minimal 6 karakter'
        );

        return;
    }

    const emailRegex =
       /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

    alert(
        'Format email tidak valid'
    );

    return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/register`,
            {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );

        const data =
            await response.json();

        alert(data.message);

        if (response.ok) {

            window.location.href =
                'login.html';
        }

    } catch (err) {

        console.error(err);

        alert(
            'Tidak dapat terhubung ke server'
        );
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form =
        document.getElementById('register-form');

    if (!form) {
        return;
    }

    form.addEventListener('submit', event => {
        event.preventDefault();
        register();
    });
});
