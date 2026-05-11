import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { Product } from '../../lib/woocommerce';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 250,
    marginBottom: 40,
  },
  imageSection: {
    width: '60%',
    height: '100%',
    backgroundColor: '#f5f3f3',
  },
  detailsSection: {
    width: '40%',
    paddingLeft: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Bodoni Moda',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: '#0e0f0f',
    marginBottom: 5,
  },
  label: {
    fontSize: 8,
    textTransform: 'uppercase',
    color: '#444748',
  }
});

export const Asymmetric = ({ product }: { product: Product }) => (
  <View style={styles.container} wrap={false}>
    <View style={styles.imageSection}>
      {product.imageUrl && <Image src={product.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
    </View>
    <View style={styles.detailsSection}>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <Text style={styles.label}>{product.sku}</Text>
    </View>
  </View>
);
