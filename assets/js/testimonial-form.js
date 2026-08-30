// WebGraha — testimonial form submission (testimonials.html)
//
// Posts to the same Apps Script endpoint as the homepage enquiry form
// (see enquiry-form.js), distinguished by a "formType": "testimonial"
// field in the payload so Code.gs can route it to its own Sheet tab. The
// endpoint URL comes from assets/js/site-config.js
// (WEBGRAHA_CONFIG.FORM_ENDPOINT) — a form's own data-endpoint attribute,
// if set, overrides the shared config.
(function () {
    const form      = document.getElementById('testimonial-form');
    if (!form) return;

    const formCard  = document.getElementById('testimonial-form-card');
    const sentCard  = document.getElementById('testimonial-sent-card');
    const errorEl   = document.getElementById('testimonial-error');
    const submitBtn = document.getElementById('testimonial-submit-btn');
    const stars     = Array.from(document.querySelectorAll('.rating-star'));
    const ratingGroup = document.getElementById('rating-stars');
    const ratingInput = document.getElementById('rating-value');

    const ENDPOINT = (form.getAttribute('data-endpoint') || (window.WEBGRAHA_CONFIG && window.WEBGRAHA_CONFIG.FORM_ENDPOINT) || '').trim();
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function paintStars(value) {
        stars.forEach((star) => {
            star.classList.toggle('is-active', Number(star.dataset.value) <= value);
        });
    }

    stars.forEach((star) => {
        star.addEventListener('mouseenter', () => paintStars(Number(star.dataset.value)));
        star.addEventListener('click', () => {
            ratingInput.value = star.dataset.value;
            paintStars(Number(star.dataset.value));
        });
    });
    if (ratingGroup) {
        ratingGroup.addEventListener('mouseleave', () => paintStars(Number(ratingInput.value) || 0));
    }

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
            formType: 'testimonial',
            name:     form.name.value.trim(),
            company:  form.company.value.trim(),
            role:     form.role.value.trim(),
            email:    form.email.value.trim(),
            logoUrl:  form.logoUrl.value.trim(),
            rating:   ratingInput.value,
            quote:    form.quote.value.trim(),
            publish:  form.publish.checked
        };

        if (!payload.name || !payload.company || !payload.role || !payload.email || !payload.quote) {
            showError('Please fill in your name, company, role, email, and a short testimonial.');
            return;
        }
        if (!EMAIL_RE.test(payload.email)) {
            showError('That email address doesn’t look right — please double-check it.');
            return;
        }
        if (!ratingInput.value) {
            showError('Please choose a star rating.');
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
            paintStars(0);
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
            submitBtn.textContent = 'Submit Testimonial';
        }
    });
})();
