const SUBJECTS = [
    { code: 'CS3212', name: 'Design and Analysis of Algorithm' },
    { code: 'CS3213', name: 'Computer Networks' },
    { code: 'CS3212A', name: 'Web Technologies' },
    { code: 'MM0701B', name: 'Ethical Hacking' },
];

const tableBody = document.getElementById('subjectRows');

SUBJECTS.forEach((subject, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${subject.code}</td>
    <td>${subject.name}</td>
    <td><input type="number" min="0" max="50" class="mark-input" id="mse${index + 1}" /></td>
    <td><input type="number" min="0" max="100" class="mark-input" id="ese${index + 1}" /></td>
  `;
    tableBody.appendChild(row);
});

document.getElementById('submitBtn').addEventListener('click', async () => {
    const studentName = document.getElementById('studentName').value.trim();
    const regNumber = document.getElementById('regNumber').value.trim();

    if (!studentName || !regNumber) {
        alert('Please enter student name and registration number.');
        return;
    }

    const payload = {
        studentName,
        regNumber,
        mse1: parseFloat(document.getElementById('mse1').value) || 0,
        ese1: parseFloat(document.getElementById('ese1').value) || 0,
        mse2: parseFloat(document.getElementById('mse2').value) || 0,
        ese2: parseFloat(document.getElementById('ese2').value) || 0,
        mse3: parseFloat(document.getElementById('mse3').value) || 0,
        ese3: parseFloat(document.getElementById('ese3').value) || 0,
        mse4: parseFloat(document.getElementById('mse4').value) || 0,
        ese4: parseFloat(document.getElementById('ese4').value) || 0,
    };

    try {
        const response = await fetch('/api/results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Server error');

        const result = await response.json();
        displayResult(result);
    } catch (error) {
        alert('Failed to calculate result. Check the console for details.');
        console.error(error);
    }
});

function displayResult(result) {
    const summaryDiv = document.getElementById('resultSummary');
    const isPass = result.percentage >= 40;

    summaryDiv.className = `result-summary ${isPass ? 'pass' : 'fail'}`;
    summaryDiv.innerHTML = `
    <h3>Result Summary — ${result.studentName} (${result.regNumber})</h3>
    <div class="summary-grid">
      <div>
        <span class="label">Total Weighted Marks</span>
        <span class="value">${result.totalWeighted.toFixed(2)} / 400</span>
      </div>
      <div>
        <span class="label">Percentage</span>
        <span class="value">${result.percentage.toFixed(2)}%</span>
      </div>
      <div>
        <span class="label">Grade</span>
        <span class="value">${result.grade}</span>
      </div>
      <div>
        <span class="label">Status</span>
        <span class="value">${isPass ? 'PASS' : 'FAIL'}</span>
      </div>
    </div>
  `;
    summaryDiv.classList.remove('hidden');
}