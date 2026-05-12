import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Product } from '../lib/woocommerce';
import { Asymmetric } from './layouts/Asymmetric';
import { Minimal } from './layouts/Minimal';
import { Technical } from './layouts/Technical';

// Temporarily disabled due to 404 TTF links. 
// For luxury fonts, download the .ttf files and put them in the /public folder.
// Font.register({
//   family: 'Bodoni Moda',
//   src: '/fonts/BodoniModa-Regular.ttf',
// });

// Font.register({
//   family: 'Hanken Grotesk',
//   src: '/fonts/HankenGrotesk-Regular.ttf',
// });

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#fbf9f9',
    fontFamily: 'Helvetica',
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
    fontFamily: 'Times-Roman',
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
