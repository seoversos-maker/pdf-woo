# WooCommerce Connector Specification

## Purpose
The WooCommerce Connector handles all communication with the WooCommerce REST API, data normalization, and error handling.

## Requirements

### Requirement: Product Fetching
The system MUST fetch published products from the `/wp-json/wc/v3/products` endpoint.

#### Scenario: Fetch Published Products
- GIVEN valid API credentials and Store URL
- WHEN a fetch request is made
- THEN the system SHALL include `status=publish` and `per_page=100` in the query
- AND SHALL return a normalized array of product objects.

### Requirement: Data Normalization
The system SHALL map WooCommerce raw data to a simplified internal `Product` type.

#### Scenario: Field Mapping
- GIVEN a raw product response from WC
- WHEN mapped to the internal type
- THEN the system MUST include `id`, `name`, `price`, `sku`, `image` (src), and `category`.

### Requirement: Error Handling
The system SHOULD handle API connection failures gracefully.

#### Scenario: API Failure
- GIVEN an invalid API key or network failure
- WHEN the system attempts to fetch data
- THEN the system SHALL display a clear error message to the user
- AND SHALL NOT attempt to generate an empty PDF.
