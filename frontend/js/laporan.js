async function submitReport(event) {

    event.preventDefault();

    const location = document.getElementById('location').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;

    const response = await fetch('http://127.0.0.1:8000/api/reports', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            location,
            category,
            description
        })
    });

    const data = await response.json();

    alert(data.message);

    loadReports();
}

async function loadReports() {

    const response = await fetch('http://127.0.0.1:8000/api/reports');

    const reports = await response.json();

    let html = '';

    reports.forEach(report => {

        html += `
            <div class="card p-3 mb-3">
                <h5>${report.category}</h5>
                <p><b>Lokasi:</b> ${report.location}</p>
                <p>${report.description}</p>
                <div class="mt-2">

    <span class="badge bg-warning text-dark">
        ${report.status}
    </span>

    <button type="button" class="btn btn-sm btn-success ms-2"
        onclick="updateStatus(${report.id}, 'Diproses')">
        Diproses
    </button>

    <button type="button" class="btn btn-sm btn-primary ms-2"
        onclick="updateStatus(${report.id}, 'Selesai')">
        Selesai
    </button>

</div>
            </div>
        `;
    });

    document.getElementById('reportList').innerHTML = html;
}

loadReports();

async function updateStatus(id, status) {

    await fetch(`http://127.0.0.1:8000/api/reports/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status
        })
    });

    loadReports();
}
