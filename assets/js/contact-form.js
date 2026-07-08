// WebGraha — contact page form submission (contact.html)
//
// Posts to the same Apps Script endpoint as the homepage enquiry widget
// (see enquiry-form.js), just as an always-visible card instead of a
// collapsible widget. No "formType" field is sent, so Code.gs routes it
// to the default enquiry handler. The endpoint URL is read from the
// form's data-endpoint attribute.
(function () {
    const form      = document.getElementById('contact-form');
    if (!form) return;

    const formCard  = document.getElementById('contact-form-card');
    const sentCard  = document.getElementById('contact-sent-card');
    const errorEl   = document.getElementById('contact-error');
    const submitBtn = document.getElementById('contact-submit-btn');

    const ENDPOINT = (form.getAttribute('data-endpoint') || '').trim();
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showError(msg) {
        errorEl.textContent = msg;
        errorEl.classList.remove('hidden');
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorEl.classList.add('hidden');

        if (!ENDPOINT) {
            showError('Form isn’t connected yet — see google-apps-script/SETUP.md.');
            return;
        }

        const payload = {
            name:    form.name.value.trim(),
            email:   form.email.value.trim(),
            message: form.message.value.trim()
        };

        if (!payload.name) {
            showError('Please enter your name.');
            return;
        }
        if (!payload.email) {
            showError('Please enter your email address.');
            return;
        }
        if (!EMAIL_RE.test(payload.email)) {
            showError('That email address doesn’t look right — please double-check it.');
            return;
        }

        submitBtn.disabled    = true;
        submitBtn.textContent = 'Sending…';

        try {
            const res = await fetch(ENDPOINT, {
                method: 'POST',
                // text/plain avoids a CORS preflight against the Apps Script endpoint.
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload)
            });

            let data;
            try {
                data = await res.json();
            } catch (_) {
                throw new Error('Unexpected response from server. Open the Apps Script URL in a browser tab to re-authorize, then try again.');
            }

            if (!data.ok) {
                showError(data.error || 'Something went wrong on our end.');
                return;
            }

            form.reset();
            formCard.classList.add('hidden');
            sentCard.classList.remove('hidden');

        } catch (err) {
            const isNetworkError = err instanceof TypeError;
            showError(
                isNetworkError
                    ? 'Network error — check your connection or try again.'
                    : (err.message || 'Couldn’t send that — please try again or email us directly.')
            );
        } finally {
            submitBtn.disabled    = false;
            submitBtn.textContent = 'Send Message';
        }
    });
})();
