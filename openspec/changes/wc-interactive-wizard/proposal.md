# Proposal: Interactive WC Wizard

## Intent
Provide a user-friendly, multi-step configuration process to connect to WooCommerce and select specific product categories for the catalog.

## Scope
- Connection form with localStorage persistence.
- Category selector with multi-select checkboxes.
- Filtered product fetching based on selected categories.
- Navigation flow: IDLE -> CONNECTING -> SELECTING -> READY.

## Capabilities
- `credentials-management`: Handled in Wizard.
- `category-selector`: New capability to list and pick WC categories.
- `filtered-catalog`: Modification to PDF generator to support category filters.
