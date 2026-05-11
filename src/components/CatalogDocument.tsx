import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Product } from '../lib/woocommerce';
import { Asymmetric } from './layouts/Asymmetric';
import { Minimal } from './layouts/Minimal';
import { Technical } from './layouts/Technical';

// Registering fonts for luxury aesthetic
Font.register({
  family: 'Bodoni Moda',
  src: 'https://fonts.gstatic.com/s/bodonimoda/v25/a9m97jf8WAtS3Pa99as72r3-C_K8X_A.ttf',
});

Font.register({
  family: 'Hanken Grotesk',
  src: 'https://fonts.gstatic.com/s/hankengrotesk/v5/m8JXjfX8WAtS3Pa99as72r3-C_K8X_A.ttf',
});

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#fbf9f9',
    fontFamily: 'Hanken Grotesk',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: 15,
    marginBottom: 20,
  },
  logo: {
    fontSize: 48,
    fontFamily: 'Bodoni Moda',
    textTransform: 'uppercase',
    color: '#0e0f0f',
  },
  collectionLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#444748',
  },
  categoryTitle: {
    fontSize: 24,
    fontFamily: 'Bodoni Moda',
    textTransform: 'uppercase',
    marginBottom: 30,
    marginTop: 40,
    borderLeftWidth: 4,
    paddingLeft: 10,
  }
});

interface Props {
  products: Product[];
}

export const CatalogDocument = ({ products }: Props) => {
  // Group products by category
  const grouped = products.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <Document>
      {Object.entries(grouped).map(([category, items]) => (
        <Page key={category} size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.logo}>L'ARTISAN</Text>
            <Text style={styles.collectionLabel}>Catálogo WooCommerce</Text>
          </View>
          
          <Text style={[styles.categoryTitle, { borderLeftColor: '#0e0f0f' }]}>
            {category}
          </Text>

          <View>
            {items.map((item, index) => {
              const layoutIndex = index % 3;
              if (layoutIndex === 0) return <Asymmetric key={item.id} product={item} />;
              if (layoutIndex === 1) return <Minimal key={item.id} product={item} />;
              return <Technical key={item.id} product={item} />;
            })}
          </View>
        </Page>
      ))}
    </Document>
  );
};
