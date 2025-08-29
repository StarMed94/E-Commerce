import { create } from 'zustand';
import { supabase, CartItem, Product } from '../lib/supabase';

interface CartState {
  items: CartItem[];
  loading: boolean;
  fetchCartItems: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<{ error?: string }>;
  updateQuantity: (itemId: string, quantity: number) => Promise<{ error?: string }>;
  removeFromCart: (itemId: string) => Promise<{ error?: string }>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,

  fetchCartItems: async () => {
    set({ loading: true });
    const { data } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .order('created_at', { ascending: false });

    set({ items: data || [], loading: false });
  },

  addToCart: async (productId: string, quantity = 1) => {
    try {
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('product_id', productId)
        .single();

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (error) return { error: error.message };
      } else {
        // Insert new item
        const { error } = await supabase
          .from('cart_items')
          .insert({ product_id: productId, quantity });

        if (error) return { error: error.message };
      }

      await get().fetchCartItems();
      return {};
    } catch (error) {
      return { error: 'حدث خطأ في إضافة المنتج للسلة' };
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        return get().removeFromCart(itemId);
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) return { error: error.message };

      await get().fetchCartItems();
      return {};
    } catch (error) {
      return { error: 'حدث خطأ في تحديث الكمية' };
    }
  },

  removeFromCart: async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) return { error: error.message };

      await get().fetchCartItems();
      return {};
    } catch (error) {
      return { error: 'حدث خطأ في حذف المنتج' };
    }
  },

  clearCart: async () => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (!error) {
      set({ items: [] });
    }
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));
