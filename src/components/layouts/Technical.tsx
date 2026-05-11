import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { Product } from '../../lib/woocommerce';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 200,
    marginBottom: 40,
    backgroundColor: '#f5f3f3',
  },
  detailsSection: {
    width: '50%',
    padding: 20,
    justifyContent: 'center',
  },
  imageSection: {
    width: '50%',
    height: '100%',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Bodoni Moda',
    marginBottom: 10,
  },
  price: {
    fontSize: 14,
    marginBottom: 5,
  },
  stock: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#747878',
  }
});

export const Technical = ({ product }: { product: Product }) => (
  <View style={styles.container} wrap={false}>
    <View style={styles.detailsSection}>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <Text style={styles.stock}>{product.stockStatus}</Text>
    </View>
    <View style={styles.imageSection}>
      {product.imageUrl && <Image src={product.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
    </View>
  </View>
);
