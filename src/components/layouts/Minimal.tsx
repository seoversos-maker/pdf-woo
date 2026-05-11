import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { Product } from '../../lib/woocommerce';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  imageWrapper: {
    width: '100%',
    height: 300,
    backgroundColor: '#f5f3f3',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Bodoni Moda',
    textAlign: 'center',
  },
  price: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  }
});

export const Minimal = ({ product }: { product: Product }) => (
  <View style={styles.container} wrap={false}>
    <View style={styles.imageWrapper}>
      {product.imageUrl && <Image src={product.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
    </View>
    <Text style={styles.title}>{product.name}</Text>
    <Text style={styles.price}>${product.price}</Text>
  </View>
);
