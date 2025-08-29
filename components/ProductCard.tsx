import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Product } from '../lib/supabase';
import { Button } from './ui/Button';
import { useCartStore } from '../stores/cartStore';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const { addToCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    await addToCart(product.id);
    setLoading(false);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: product.image_url || 'https://img-wrapper.vercel.app/image?url=https://placehold.co/200x200.png' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.price}>{product.price.toFixed(2)} ر.س</Text>
        <Text style={styles.stock}>متوفر: {product.stock_quantity}</Text>
        
        <Button
          onPress={handleAddToCart}
          loading={loading}
          disabled={product.stock_quantity <= 0}
          size="sm"
        >
          {product.stock_quantity <= 0 ? 'غير متوفر' : 'أضف للسلة'}
        </Button>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'right',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
    textAlign: 'right',
  },
  stock: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'right',
  },
});
