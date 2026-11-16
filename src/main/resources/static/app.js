const SUBJECTS = [
    { code: 'CS3212', name: 'Design and Analysis of Algorithm' },
    { code: 'CS3213', name: 'Computer Networks' },
    { code: 'CS3212A', name: 'Web Technologies' },
    { code: 'MM0701B', name: 'Ethical Hacking' },
];

const LIMITS = { mse: 50, ese: 100 };

// Styles for invalid inputs and error messages
const style = document.createElement('style');
style.textContent = `
  .mark-input.invalid { border-color: #dc2626; background: #fef2f2; }
  .mark-error { display: block; min-height: 16px; margin-top: 4px; font-size: 0.75rem; color: #dc2626; }
  #formError { margin-top: 12px; padding: 10px 14px; border-radius: 8px;
               background: #fef2f2; color: #b91c1c; font-size: 0.9rem; font-weight: 500; }
  #formError:empty { display: none; }
`;
document.head.appendChild(style);

// Build the subject rows
const tableBody = document.getElementById('subjectRows');

SUBJECTS.forEach((subject, index) => {
    const n = index + 1;
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${subject.code}</td>
    <td>${subject.name}</td>
    <td>
      <input type="number" min="0" max="50" step="0.5" class="mark-input" id="mse${n}" placeholder="0 to 50" />
      <small class="mark-error" id="mse${n}-error"></small>
    </td>
    <td>
      <input type="number" min="0" max="100" step="0.5" class="mark-input" id="ese${n}" placeholder="0 to 100" />
      <small class="mark-error" id="ese${n}-error"></small>
    </td>
  `;
    tableBody.appendChild(row);
});

// Error box under the submit button
const submitBtn = document.getElementById('submitBtn');
const formError = document.createElement('div');
formError.id = 'formError';
submitBtn.insertAdjacentElement('afterend', formError);

function showFormError(message) {
    formError.textContent = message;
}

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
}

function markFields() {
    const fields = [];
    SUBJECTS.forEach((_, index) => {
        const n = index + 1;
        fields.push({ input: document.getElementById(`mse${n}`), max: LIMITS.mse });
        fields.push({ input: document.getElementById(`ese${n}`), max: LIMITS.ese });
    });
    return fields;
}

// Returns true if the mark is valid, and shows the error under the input if not
function validateMark(input, max) {
    const raw = input.value.trim();
    const value = Number(raw);
    let message = '';

    if (raw === '') message = 'Required';
    else if (!Number.isFinite(value)) message = 'Not a number';
    else if (value < 0) message = 'Cannot be negative';
    else if (value > max) message = `Max is ${max}`;

    input.classList.toggle('invalid', message !== '');
    document.getElementById(`${input.id}-error`).textContent = message;
    return message === '';
}

// Live validation while typing
markFields().forEach(({ input, max }) => {
    input.addEventListener('input', () => {
        validateMark(input, max);
        if (formError.textContent) showFormError('');
    });
});

submitBtn.addEventListener('click', async () => {
    const studentName = document.getElementById('studentName').value.trim();
    const regNumber = document.getElementById('regNumber').value.trim();

    if (!studentName || !regNumber) {
        showFormError('Enter the student name and registration number.');
        return;
    }

    const fields = markFields();
    const invalid = fields.filter(({ input, max }) => !validateMark(input, max));

    if (invalid.length > 0) {
        showFormError(
            `${invalid.length} mark${invalid.length > 1 ? 's are' : ' is'} missing or out of range. MSE is out of 50 and ESE is out of 100.`
        );
        invalid[0].input.focus();
        return;
    }

    showFormError('');

    const mark = (id) => Number(document.getElementById(id).value);
    const payload = {
        studentName,
        regNumber,
        mse1: mark('mse1'), ese1: mark('ese1'),
        mse2: mark('mse2'), ese2: mark('ese2'),
        mse3: mark('mse3'), ese3: mark('ese3'),
        mse4: mark('mse4'), ese4: mark('ese4'),
    };

    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    try {
        const response = await fetch('/api/results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const body = await response.json().catch(() => null);
            throw new Error(body?.message || `Server error (${response.status})`);
        }

        const result = await response.json();
        displayResult(result);
    } catch (error) {
        showFormError(`Could not save the result: ${error.message}`);
        console.error(error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});

function displayResult(result) {
    const summaryDiv = document.getElementById('resultSummary');
    const isPass = result.percentage >= 40;

    summaryDiv.className = `result-summary ${isPass ? 'pass' : 'fail'}`;
    summaryDiv.innerHTML = `
    <h3>Result Summary &mdash; ${escapeHtml(result.studentName)} (${escapeHtml(result.regNumber)})</h3>
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
    summaryDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}