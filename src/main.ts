// buildStamp: 2025-10-31T00:00:00Z - injected to force rebuild
import './style.css'


// Update copyright year
document.getElementById('year')!.textContent = new Date().getFullYear().toString();

// Expose build stamp on the root element (visible in DOM)
try {
	document.documentElement.setAttribute('data-build-stamp', '2025-10-31T00:00:00Z')
} catch (e) {
	// ignore server-side or build-time failures
}

// --- Multi-step form logic ---
type MaybeHTMLElement = HTMLElement | null;

const apiEndpoint = document.documentElement.getAttribute('data-api-endpoint') || '';

const openBtn = document.getElementById('open-rental-form-btn') as MaybeHTMLElement;
const modal = document.getElementById('rental-modal') as MaybeHTMLElement;
const modalClose = document.getElementById('modal-close') as MaybeHTMLElement;
const step1Next = document.getElementById('step1-next') as MaybeHTMLElement;
const step2Back = document.getElementById('step2-back') as MaybeHTMLElement;
const step2Next = document.getElementById('step2-next') as MaybeHTMLElement;
const step3Back = document.getElementById('step3-back') as MaybeHTMLElement;
const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement | null;
const incomeInput = document.getElementById('income-input') as HTMLInputElement | null;
const sizeInput = document.getElementById('size-input') as HTMLInputElement | null;
const reviewIncome = document.getElementById('review-income') as HTMLElement | null;
const reviewSize = document.getElementById('review-size') as HTMLElement | null;
const formMessage = document.getElementById('form-message') as HTMLElement | null;

function showModal() {
	if (!modal) return;
	modal.setAttribute('aria-hidden', 'false');
	// show first step
	const steps = modal.querySelectorAll('.form-step');
	steps.forEach(s => { (s as HTMLElement).hidden = false; });
	// hide steps 2..n
	steps.forEach((s, i) => { if (i !== 0) (s as HTMLElement).hidden = true; });
	const firstInput = modal.querySelector('input');
	if (firstInput) (firstInput as HTMLElement).focus();
}

function hideModal() {
	if (!modal) return;
	modal.setAttribute('aria-hidden', 'true');
}

function goToStep(n: number) {
	if (!modal) return;
	const steps = Array.from(modal.querySelectorAll('.form-step')) as HTMLElement[];
	steps.forEach((s, i) => { s.hidden = (i + 1) !== n; });
}

function validateStep1() {
	if (!incomeInput) return false;
	const v = Number(incomeInput.value);
	return !Number.isNaN(v) && v >= 0;
}

function validateStep2() {
	if (!sizeInput) return false;
	const v = Number(sizeInput.value);
	return Number.isInteger(v) && v >= 1;
}

if (openBtn) {
	openBtn.addEventListener('click', (e) => {
		e.preventDefault();
		showModal();
	});
}

if (modalClose) modalClose.addEventListener('click', hideModal);

if (step1Next) step1Next.addEventListener('click', () => {
	if (!validateStep1()) {
		if (formMessage) formMessage.textContent = 'Please enter a valid income amount.';
		return;
	}
	if (formMessage) formMessage.textContent = '';
	goToStep(2);
	if (sizeInput) sizeInput.focus();
});

if (step2Back) step2Back.addEventListener('click', () => { goToStep(1); if (incomeInput) incomeInput.focus(); });
if (step2Next) step2Next.addEventListener('click', () => {
	if (!validateStep2()) { if (formMessage) formMessage.textContent = 'Please enter a valid household size (1 or more).'; return; }
	if (formMessage) formMessage.textContent = '';
	// update review
	if (reviewIncome && incomeInput) reviewIncome.textContent = `$${Number(incomeInput.value).toLocaleString()}`;
	if (reviewSize && sizeInput) reviewSize.textContent = sizeInput.value;
	goToStep(3);
});

if (step3Back) step3Back.addEventListener('click', () => { goToStep(2); if (sizeInput) sizeInput.focus(); });

if (submitBtn) {
	submitBtn.addEventListener('click', async (e) => {
		e.preventDefault();
		if (!validateStep1() || !validateStep2()) { if (formMessage) formMessage.textContent = 'Please complete the form before submitting.'; return; }

		const payload = { income: Number(incomeInput?.value || 0), householdSize: Number(sizeInput?.value || 0) };
		if (!apiEndpoint) {
			if (formMessage) formMessage.textContent = 'No API endpoint configured. Please set data-api-endpoint on the <html> element.';
			return;
		}

		try {
			submitBtn.disabled = true;
			submitBtn.textContent = 'Sending...';
			if (formMessage) formMessage.textContent = 'Sending to server...';

			const resp = await fetch(apiEndpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			if (!resp.ok) {
				const text = await resp.text();
				throw new Error(`Server error: ${resp.status} ${text}`);
			}

			const data = await resp.json().catch(() => null);
			if (formMessage) formMessage.textContent = 'Submitted successfully.';
			// Optionally show returned data
			console.log('submit response', data);
			setTimeout(() => hideModal(), 800);
		} catch (err: any) {
			console.error('submit error', err);
			if (formMessage) formMessage.textContent = `Submission failed: ${err.message || err}`;
		} finally {
			if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit'; }
		}
	});
}

// Close modal on overlay click
if (modal) {
	modal.addEventListener('click', (ev) => {
		if (ev.target === modal) hideModal();
	});
}
