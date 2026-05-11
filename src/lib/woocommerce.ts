export interface Product {
  id: number;
  name: string;
  price: string;
  sku: string;
  imageUrl: string;
  category: string;
  stockStatus: string;
}

export interface Category {
  id: number;
  name: string;
  count: number;
}

export async function fetchCategories(creds: { url: string; key: string; secret: string }): Promise<Category[]> {
  const auth = btoa(`${creds.key}:${creds.secret}`);
  const endpoint = `${creds.url}/wp-json/wc/v3/products/categories?per_page=100&hide_empty=true`;

  try {
    const response = await fetch(endpoint, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!response.ok) throw new Error('Error al traer categorías');
    const data = await response.json();
    return data.map((c: any) => ({
      id: c.id,
      name: c.name,
      count: c.count,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchProducts(
  creds: { url: string; key: string; secret: string },
  categoryIds?: number[]
): Promise<Product[]> {
  const auth = btoa(`${creds.key}:${creds.secret}`);
  let endpoint = `${creds.url}/wp-json/wc/v3/products?per_page=100&status=publish`;
  
  if (categoryIds && categoryIds.length > 0) {
    endpoint += `&category=${categoryIds.join(',')}`;
  }

  try {
    const response = await fetch(endpoint, {
      headers: { Authorization: `Basic ${auth}` },
    });

    if (!response.ok) throw new Error(`WC API error: ${response.statusText}`);

    const data = await response.json();
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      sku: item.sku,
      imageUrl: item.images?.[0]?.src || '',
      category: item.categories?.[0]?.name || 'General',
      stockStatus: item.stock_status === 'instock' ? 'Disponible' : 'Agotado',
    }));
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}
