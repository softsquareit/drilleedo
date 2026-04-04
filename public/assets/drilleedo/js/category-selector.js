/**
 * Category Selector Utility
 * Handles dynamic Parent -> Child category selection via AJAX
 * Strictly enforces business rules: child is mandatory, disabled until parent is picked.
 */
document.addEventListener('DOMContentLoaded', function () {
    const parentSelects = document.querySelectorAll('select.parent-category-select');

    parentSelects.forEach(parentSelect => {
        const form = parentSelect.closest('form') || parentSelect.parentElement;
        const childSelect = form.querySelector('select.child-category-select');

        if (!childSelect) return;

        // --- Business Rule Implementation ---

        // 1. Ensure child is always required
        childSelect.required = true;

        // 2. Refresh function for SelectPicker
        function refreshSelectPicker(el) {
            if (typeof $ !== 'undefined') {
                const $el = $(el);
                // Try to initialize if not already done, or just refresh
                if ($el.data('selectpicker')) {
                    $el.selectpicker('refresh');
                } else if ($el.hasClass('selectpicker')) {
                    $el.selectpicker();
                }

                // Ensure the 'disabled' visual state is updated in the custom dropdown
                const $parent = $el.parent('.bootstrap-select');
                if ($parent.length) {
                    if (el.disabled) {
                        $parent.addClass('disabled');
                        $el.selectpicker('setStyle', 'disabled', 'add');
                    } else {
                        $parent.removeClass('disabled');
                        $el.selectpicker('setStyle', 'disabled', 'remove');
                    }
                }
            }
        }

        // 3. Initial state check (important for edit forms)
        const initSelection = () => {
            const parentId = parentSelect.value;
            const currentChildId = childSelect.getAttribute('data-selected-id') || childSelect.value;

            if (!parentId) {
                childSelect.disabled = true;
                // Keep the placeholder
                if (childSelect.options.length === 0 || (childSelect.options.length === 1 && childSelect.options[0].value === "")) {
                    childSelect.innerHTML = '<option value="">Select a specific service</option>';
                }
            } else if (childSelect.options.length <= 1) { // If only placeholder exists but parent is selected
                loadChildren(parentId, currentChildId);
            }
            refreshSelectPicker(childSelect);
        };

        // 4. Load children function
        function loadChildren(parentId, selectedId = null) {
            childSelect.disabled = true;
            childSelect.innerHTML = '<option value="">Loading...</option>';
            refreshSelectPicker(childSelect);

            fetch(`/api/categories/${parentId}/children`)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then(data => {
                    childSelect.innerHTML = '<option value="">Select a specific service</option>';
                    data.forEach(child => {
                        const option = document.createElement('option');
                        option.value = child.id;
                        option.textContent = child.name;
                        if (selectedId && child.id == selectedId) {
                            option.selected = true;
                        }
                        childSelect.appendChild(option);
                    });

                    childSelect.disabled = false;
                    childSelect.required = true;
                })
                .catch(err => {
                    console.error('Category fetch error:', err);
                    childSelect.innerHTML = '<option value="">Error loading categories</option>';
                    childSelect.disabled = true;
                })
                .finally(() => {
                    refreshSelectPicker(childSelect);
                });
        }

        // Run initial check
        initSelection();

        // 5. Handle change events
        // Use both 'change' and 'changed.bs.select' for compatibility
        const handleChange = function () {
            const parentId = parentSelect.value;

            if (!parentId) {
                childSelect.innerHTML = '<option value="">Select a specific service</option>';
                childSelect.disabled = true;
                refreshSelectPicker(childSelect);
                return;
            }

            loadChildren(parentId);
        };

        parentSelect.addEventListener('change', handleChange);
        if (typeof $ !== 'undefined') {
            $(parentSelect).on('changed.bs.select', handleChange);
        }
    });

    // Handle form submission loading state for all forms with category selects
    const formsWithCategories = document.querySelectorAll('form');
    formsWithCategories.forEach(form => {
        if (form.querySelector('select.child-category-select')) {
            form.addEventListener('submit', function (e) {
                if (!this.checkValidity()) return;

                const submitBtn = this.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.innerHTML;
                    // Don't disable immediately if we want to allow validation, but here we checkValidity above
                    setTimeout(() => {
                        submitBtn.disabled = true;
                        submitBtn.innerHTML = '<i class="feather-loader me-2" style="animation: spin 1s linear infinite;"></i> Processing...';
                    }, 10);
                }
            });
        }
    });
});
