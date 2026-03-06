/**
 * Category Selector Utility
 * Handles dynamic Parent -> Child category selection via AJAX
 * Strictly enforces business rules: child is mandatory, disabled until parent is picked.
 */
document.addEventListener('DOMContentLoaded', function () {
    const parentSelects = document.querySelectorAll('.parent-category-select');

    parentSelects.forEach(parentSelect => {
        const form = parentSelect.closest('form') || parentSelect.parentElement;
        const childSelect = form.querySelector('.child-category-select');

        if (!childSelect) return;

        // --- Business Rule Implementation ---

        // 1. Ensure child is always required
        childSelect.required = true;

        // 2. Refresh function for SelectPicker
        function refreshSelectPicker(el) {
            if (typeof $ !== 'undefined' && $(el).data('selectpicker')) {
                $(el).selectpicker('refresh');
                // Ensure the 'disabled' visual state is updated in the custom dropdown
                if (el.disabled) {
                    $(el).selectpicker('setStyle', 'disabled', 'add');
                    $(el).parent().addClass('disabled');
                } else {
                    $(el).selectpicker('setStyle', 'disabled', 'remove');
                    $(el).parent().removeClass('disabled');
                }
            }
        }

        // 3. Initial state check (important for edit forms)
        const initSelection = () => {
            const parentId = parentSelect.value;
            const currentChildId = childSelect.getAttribute('data-selected-id') || childSelect.value;

            if (!parentId) {
                childSelect.disabled = true;
                childSelect.innerHTML = '<option value="">Select a sub-category</option>';
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
                    childSelect.innerHTML = '<option value="">Select a sub-category</option>';
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
        parentSelect.addEventListener('change', function () {
            const parentId = this.value;

            if (!parentId) {
                childSelect.innerHTML = '<option value="">Select a sub-category</option>';
                childSelect.disabled = true;
                refreshSelectPicker(childSelect);
                return;
            }

            loadChildren(parentId);
        });
    });

    // Handle form submission loading state for all forms with category selects
    const formsWithCategories = document.querySelectorAll('form');
    formsWithCategories.forEach(form => {
        if (form.querySelector('.child-category-select')) {
            form.addEventListener('submit', function (e) {
                if (!this.checkValidity()) return;

                const submitBtn = this.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.innerHTML;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="feather-loader me-2" style="animation: spin 1s linear infinite;"></i> Processing...';
                }
            });
        }
    });
});
