# Editorial Layouts Specification

## Purpose
The Editorial Layouts capability implements the visual design system for product presentation in the PDF, using a cyclical pattern for high aesthetic value.

## Requirements

### Requirement: Cyclical Rendering
The system MUST alternate between three layout types based on the product index within its category.

#### Scenario: Pattern Application
- GIVEN a list of products in a category
- WHEN rendering index 0, 3, 6...
- THEN the system SHALL apply the `Asymmetric` layout.
- WHEN rendering index 1, 4, 7...
- THEN the system SHALL apply the `Minimal` layout.
- WHEN rendering index 2, 5, 8...
- THEN the system SHALL apply the `Technical` layout.

### Requirement: Asymmetric Layout (Type 0)
The system SHALL render a large image (60% width) on the left and metadata on the right.

#### Scenario: Type 0 Layout
- GIVEN a product assigned to index 0
- WHEN rendered in PDF
- THEN the image SHALL occupy the left column
- AND the title/price SHALL be vertically centered in the right column.

### Requirement: Minimal Layout (Type 1)
The system SHALL render a square centered image with text below.

#### Scenario: Type 1 Layout
- GIVEN a product assigned to index 1
- WHEN rendered in PDF
- THEN the image SHALL be centered horizontally
- AND the title SHALL use a Serif font variant below the image.

### Requirement: Technical Layout (Type 2)
The system SHALL render image on the right and details on the left with a subtle background color.

#### Scenario: Type 2 Layout
- GIVEN a product assigned to index 2
- WHEN rendered in PDF
- THEN the details SHALL have a background color matching the category theme
- AND the image SHALL occupy the right column.
