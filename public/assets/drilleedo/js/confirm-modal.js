/**
 * Global Confirmation Modal Utility
 * Handles data-confirm attributes on buttons and forms
 */
document.addEventListener('DOMContentLoaded', function () {
    const modalElement = document.getElementById('globalConfirmModal');
    if (!modalElement) return;

    const modal = new bootstrap.Modal(modalElement);
    const confirmBtn = document.getElementById('globalConfirmBtn');
    const messageElem = document.getElementById('globalConfirmMessage');
    const titleElem = document.getElementById('globalConfirmTitle');

    let pendingAction = null;

    document.addEventListener('click', function (e) {
        let target = e.target;

        // Find closest element with data-confirm
        const trigger = target.closest('[data-confirm]');
        if (!trigger) return;

        // If it's a form submit button, we let the form handler deal with it if it's on the form
        // But if it's on the button itself, we handle it here
        if (trigger.tagName === 'A' || (trigger.tagName === 'BUTTON' && trigger.type !== 'submit')) {
            e.preventDefault();
            showConfirm(trigger, () => {
                if (trigger.tagName === 'A') {
                    window.location.href = trigger.href;
                } else {
                    // Custom action or trigger click without confirmation
                    trigger.dispatchEvent(new CustomEvent('confirm-success'));
                }
            });
        }
    });

    document.addEventListener('submit', function (e) {
        const form = e.target;
        const confirmMsg = form.getAttribute('data-confirm');

        if (confirmMsg && !form.dataset.confirmed) {
            e.preventDefault();
            showConfirm(form, () => {
                form.dataset.confirmed = "true";
                form.submit();
            });
        }
    });

    function showConfirm(element, onConfirm) {
        const message = element.getAttribute('data-confirm') || "Are you sure?";
        const title = element.getAttribute('data-confirm-title') || "Confirm Action";
        const btnText = element.getAttribute('data-confirm-btn') || "Confirm";
        const btnClass = element.getAttribute('data-confirm-class') || "indiv-btn-primary";

        messageElem.textContent = message;
        titleElem.textContent = title;
        confirmBtn.textContent = btnText;
        confirmBtn.style.display = 'flex';

        // Show cancel button
        modalElement.querySelector('[data-bs-dismiss="modal"]').style.display = 'flex';

        // Reset classes
        confirmBtn.className = 'w-100 py-3 justify-content-center d-flex align-items-center gap-2 ' + btnClass;

        if (btnClass.includes('danger')) {
            confirmBtn.style.background = 'var(--indiv-danger)';
            confirmBtn.style.borderColor = 'var(--indiv-danger)';
        } else if (btnClass.includes('success')) {
            confirmBtn.style.background = 'var(--pro-success)';
            confirmBtn.style.borderColor = 'var(--pro-success)';
        }

        pendingAction = onConfirm;
        modal.show();
    }

    window.globalAlert = function (message, title = "Info", btnText = "OK") {
        messageElem.textContent = message;
        titleElem.textContent = title;
        confirmBtn.textContent = btnText;
        confirmBtn.className = 'w-100 py-3 justify-content-center d-flex align-items-center gap-2 indiv-btn-primary';
        confirmBtn.style.display = 'flex';

        // Hide cancel button for alerts
        modalElement.querySelector('[data-bs-dismiss="modal"]').style.display = 'none';

        pendingAction = null;
        modal.show();
    };

    window.globalConfirm = function (message, onConfirm, title = "Confirm Action", btnText = "Confirm") {
        messageElem.textContent = message;
        titleElem.textContent = title;
        confirmBtn.textContent = btnText;
        confirmBtn.style.display = 'flex';
        modalElement.querySelector('[data-bs-dismiss="modal"]').style.display = 'flex';

        pendingAction = onConfirm;
        modal.show();
    };

    confirmBtn.addEventListener('click', function () {
        if (pendingAction) {
            pendingAction();
        }
        modal.hide();
    });
});
