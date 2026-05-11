# Especificaciones Técnicas: Generador de Catálogo PDF para WooCommerce

## 1. Arquitectura y Stack Tecnológico
* **Framework Principal:** Next.js (App Router).
* **Motor de PDF:** `@react-pdf/renderer` (renderizado en servidor/Node.js).
* **Origen de Datos:** API REST nativa de WooCommerce (`/wp-json/wc/v3/products`).
* **Estilos:** CSS/Flexbox soportado por `@react-pdf/renderer` (`StyleSheet.create`).

## 2. Lógica de Extracción de Datos
* Endpoint: `GET /wp-json/wc/v3/products?per_page=100&status=publish`
* Estructura requerida por producto:
    * `id`
    * `name`
    * `price` (formateado según moneda local)
    * `sku`
    * `images[0].src` (resolución optimizada para impresión)
    * `categories[0].name`
    * `stock_status`

## 3. Lógica de Agrupación y Paginación
* Agrupar el array de productos extraídos por la categoría principal.
* Asignar un color HEX dinámico o predeterminado a cada categoría para aplicar en marcos, separadores o fondos (ej. Zarcillos: `#FF5733`, Collares: `#33FF57`).
* Configurar `wrap={true}` en el componente `<Page>` para gestionar los saltos de página automáticos.
* Configurar `wrap={false}` en los contenedores individuales de cada producto (`<View>`) para evitar cortes a la mitad al cambiar de página.

## 4. Diagramación Cíclica (Diseño Editorial)
Implementar una función de renderizado condicional basada en la operación módulo (`index % 3`) dentro del bucle de cada categoría:
* **Layout 0 (Asimétrico):** Imagen grande a la izquierda (60% ancho), metadatos a la derecha (40% ancho).
* **Layout 1 (Minimalista):** Imagen cuadrada centrada, título y precio debajo en tipografía serif.
* **Layout 2 (Ficha Técnica):** Imagen a la derecha, detalles a la izquierda con fondo sutil del color asignado a la categoría.

## 5. Localización y Limpieza de UI
* Idioma estricto: Español.
* Traducción de estados: "instock" -> "Disponible", "outofstock" -> "Agotado".
* Exclusión: Omitir botones o hipervínculos como "Read More" (irrelevantes en un PDF estático impreso o distribuido por mensajería).

## 6. Siguientes Pasos (Prompt de Ejecución)
*A partir de este documento, genera el código inicial estructurado para:*
1.  *El script de conexión y consumo de la API de WooCommerce usando fetch.*
2.  *El componente principal `<CatalogDocument />` implementando `@react-pdf/renderer`.*
3.  *Los tres componentes independientes para los layouts cíclicos (`<LayoutAsymmetric />`, `<LayoutMinimal />`, `<LayoutTechnical />`).*
