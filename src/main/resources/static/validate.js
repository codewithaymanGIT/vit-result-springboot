// Marks validation: MSE must be 0 to 50, ESE must be 0 to 100.
// Runs before app.js handles the click, and blocks submission if anything is out of range.
(function () {
    const LIMITS = { mse: 50, ese: 100 }

    const style = document.createElement('style')
    style.textContent = `
    .mark-invalid { border-color: #dc2626 !important; background: #fef2f2 !important; }
    #markError { margin-top: 12px; padding: 10px 14px; border-radius: 8px;
                 background: #fef2f2; color: #b91c1c; font-size: 0.9rem; font-weight: 500; }
  `
    document.head.appendChild(style)

    function fields() {
        const list = []
        for (let i = 1; i <= 4; i++) {
            for (const kind of ['mse', 'ese']) {
                const el = document.getElementById(kind + i)
                if (el) list.push({ el, kind })
            }
        }
        return list
    }

    function check({ el, kind }) {
        const max = LIMITS[kind]
        const raw = el.value.trim()
        const n = Number(raw)
        let msg = ''
        if (raw === '') msg = 'Required'
        else if (!Number.isFinite(n)) msg = 'Enter a number'
        else if (n < 0) msg = 'Marks cannot be negative'
        else if (n > max) msg = `${kind.toUpperCase()} is out of ${max}`
        el.classList.toggle('mark-invalid', Boolean(msg))
        el.title = msg
        return msg
    }

    function showError(text) {
        let box = document.getElementById('markError')
        const btn = document.getElementById('submitBtn')
        if (!box && btn) {
            box = document.createElement('div')
            box.id = 'markError'
            btn.insertAdjacentElement('afterend', box)
        }
        if (box) {
            box.textContent = text
            box.style.display = text ? 'block' : 'none'
        }
    }

    function validateAll() {
        const problems = fields()
            .map((f) => ({ f, msg: check(f) }))
            .filter((p) => p.msg)
        if (problems.length) {
            showError(`Fix ${problems.length} mark${problems.length > 1 ? 's' : ''}: MSE must be 0 to 50, ESE must be 0 to 100.`)
            problems[0].f.el.focus()
            return false
        }
        showError('')
        return true
    }

    function init() {
        fields().forEach((f) => {
            f.el.setAttribute('min', '0')
            f.el.setAttribute('max', String(LIMITS[f.kind]))
            f.el.addEventListener('input', () => {
                check(f)
                if (document.getElementById('markError')?.style.display === 'block') validateAll()
            })
        })
    }

    function block(e) {
        e.preventDefault()
        e.stopImmediatePropagation()
    }

    // Capture phase: runs before app.js's own click/submit handlers
    document.addEventListener('click', (e) => {
        if (e.target.closest && e.target.closest('#submitBtn') && !validateAll()) block(e)
    }, true)

    document.addEventListener('submit', (e) => {
        if (e.target.querySelector && e.target.querySelector('#submitBtn') && !validateAll()) block(e)
    }, true)

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
    else init()
})()