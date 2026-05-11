# Design: Interactive WC Wizard

## Technical Approach
Use a state machine in a `Wizard` component to orchestrate the flow. Store credentials in `localStorage` for persistence. Use standard WooCommerce REST API query parameters for category filtering.

## Architecture Decisions
- **localStorage for keys**: Chosen for simplicity in a client-side tool.
- **Categorized Fetching**: Fetching categories first allows the user to reduce the payload size by only bringing products they actually need.

## File Changes
| File | Action | Description |
|------|--------|-------------|
| `src/lib/woocommerce.ts` | Modified | Added `fetchCategories` and `categoryIds` filter. |
| `src/components/Wizard.tsx` | Create | Main flow orchestrator. |
| `src/App.tsx` | Modified | Simplified to only render Wizard. |
| `src/index.css` | Modified | Added custom scrollbar for list. |
