async function login() {

    const email =
        document.getElementById('email').value.trim();

    const password =
        document.getElementById('password').value.trim();

    if (!email || !password) {

        alert(
            'Email dan password wajib diisi'
        );

        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data =
            await response.json();

        alert(data.message);

        if (!response.ok) {
 
        localStorage.removeItem('user');

           return;
        }

        if (!response.ok) {
            return;
        }

        localStorage.setItem(
            'user',
            JSON.stringify(data.user)
        );

        if (
            data.user.role === 'admin'
        ) {

            window.location.href =
                'admin.html';

        } else {

            window.location.href =
                'mahasiswa.html';
        }

    } catch (err) {

        console.error(err);

        alert(
            'Server tidak dapat dihubungi'
        );
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form =
        document.getElementById('login-form');

    if (!form) {
        return;
    }

    form.addEventListener('submit', event => {
        event.preventDefault();
        login();
    });
});
