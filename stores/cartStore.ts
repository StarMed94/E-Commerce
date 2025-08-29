import { create } from 'zustand';
import { supabase, CartItem } from '../lib/supabase';
import { useAuthStore } from './authStore';

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
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ items: [], loading: false });
      return;
    }

    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cart items:', error);
        set({ items: [], loading: false });
        return;
      }

      set({ items: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching cart items:', error);
      set({ items: [], loading: false });
    }
  },

  addToCart: async (productId: string, quantity = 1) => {
    const { user } = useAuthStore.getState();
    if (!user) {
      return { error: 'يجب تسجيل الدخول أولاً' };
    }

    try {
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
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
          .insert({ 
            user_id: user.id,
            product_id: productId, 
            quantity 
          });

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
    const { user } = useAuthStore.getState();
    if (!user) return;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

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
