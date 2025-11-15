import { create } from "zustand";

type Plant = {
  id: string;
  name: string;
  price: number;
  image_url: string;
};

type CartStore = {
  cart: Plant[];
  addToCart: (plant: Plant) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  addToCart: (plant) => {// /app/Store/cartStore.ts
    
    const cart = get().cart;
    // duplicate check
    if (!cart.find((item) => item.id === plant.id)) {
      set({ cart: [...cart, plant] });
    }
  },
  removeFromCart: (id) => {
    set({ cart: get().cart.filter((item) => item.id !== id) });
  },
  clearCart: () => set({ cart: [] }),
}));
