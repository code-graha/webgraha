// WebGraha — "Start a Project" enquiry widget + form submission (index.html)
//
// The Apps Script endpoint URL is read from the form's data-endpoint
// attribute (see index.html). Until that attribute is filled in (see
// google-apps-script/SETUP.md), the form shows an inline error instead
// of silently failing.
(function () {
    const collapsed    = document.getElementById('enquiry-collapsed');
    const formWrap     = document.getElementById('enquiry-form-wrap');
    const collapseBtn  = document.getElementById('enquiry-collapse-btn');
    const sentEl       = document.getElementById('enquiry-sent');
    const sentCloseBtn = document.getElementById('enquiry-sent-close');
    const form         = document.getElementById('enquiry-form');
    const errorEl      = document.getElementById('enquiry-error');
    const submitBtn    = document.getElementById('enquiry-submit-btn');
    if (!form) return;

    const ENQUIRY_ENDPOINT = (form.getAttribute('data-endpoint') || '').trim();

    collapsed.addEventListener('click', () => {
        collapsed.classList.add('hidden');
        formWrap.classList.remove('hidden');
    });
    collapseBtn.addEventListener('click', () => {
        formWrap.classList.add('hidden');
        collapsed.classList.remove('hidden');
    });

    sentCloseBtn.addEventListener('click', () => {
        sentEl.classList.add('hidden');
        collapsed.classList.remove('hidden');
    });

    function showError(msg) {
        errorEl.textContent = msg;
        errorEl.classList.remove('hidden');
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorEl.classList.add('hidden');

        if (!ENQUIRY_ENDPOINT) {
            showError('Form isn’t connected yet — see google-apps-script/SETUP.md.');
            return;
        }

        const payload = {
            name:    form.name.value.trim(),
            email:   form.email.value.trim(),
            message: form.message.value.trim()
        };

        submitBtn.disabled    = true;
        submitBtn.textContent = 'Sending…';

        try {
            const res = await fetch(ENQUIRY_ENDPOINT, {
                method: 'POST',
                // text/plain avoids a CORS preflight against the Apps Script endpoint.
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload)
            });

            let data;
            try {
                data = await res.json();
            } catch (_) {
                // Response wasn't JSON — usually means the Apps Script deployment
                // needs to be (re-)authorized. Open the /exec URL directly in a
                // browser tab; if Google prompts for authorization, complete it,
                // then try the form again.
                throw new Error('Unexpected response from server. Open the Apps Script URL in a browser tab to re-authorize, then try again.');
            }

            // Server returned {ok: false, error: "..."} — show the real reason.
            if (!data.ok) {
                showError(data.error || 'Something went wrong on our end.');
                return;
            }

            form.reset();
            formWrap.classList.add('hidden');
            sentEl.classList.remove('hidden');

        } catch (err) {
            // TypeError from fetch() = network/CORS failure.
            const isNetworkError = err instanceof TypeError;
            showError(
                isNetworkError
                    ? 'Network error — check your connection or try again.'
                    : (err.message || 'Couldn’t send that — please try again or email us directly.')
            );
        } finally {
            submitBtn.disabled    = false;
            submitBtn.textContent = 'Send Enquiry';
        }
    });
})();
