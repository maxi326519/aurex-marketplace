import { OrdersStatus } from "../../interfaces/Orders";
import { create } from "zustand";
import { Post } from "../../interfaces/Posts";
import axios from "axios";
import Swal from "sweetalert2";

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  description?: string;
  productId?: string;
  userId?: string;
  quantity: number;
  productInfo?: {
    sku?: string;
    category?: string;
    stock?: number;
    status?: string;
  };
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  addItem: (post: Post) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  getTotalItems: () => number;
  getTotalAmount: () => number;
  createOrder: () => Promise<void>;
  getFirstUserId: () => string | undefined;
}

const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,

  addItem: (post: Post) => {
    const { items } = get();
    const existingItem = items.find(item => item.id === post.id);
    
    if (existingItem) {
      // Si ya existe, incrementar cantidad
      set((state) => ({
        items: state.items.map(item =>
          item.id === post.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      }));
    } else {
      // Si no existe, agregar nuevo item
      const newItem: CartItem = {
        id: post.id || '',
        title: post.title,
        price: post.price,
        image: post.product?.name || "Producto",
        description: post.content,
        productId: post.productId,
        userId: post.userId,
        quantity: 1,
        productInfo: {
          sku: post.product?.sku,
          category: post.product?.category1,
          stock: post.product?.totalStock,
          status: post.product?.status,
        },
      };
      
      set((state) => ({
        items: [...state.items, newItem],
      }));
    }
    
    Swal.fire("Agregado", "Producto agregado al carrito", "success");
  },

  removeItem: (id: string) => {
    set((state) => ({
      items: state.items.filter(item => item.id !== id),
    }));
  },

  updateQuantity: (id: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    
    set((state) => ({
      items: state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      ),
    }));
  },

  clear: () => {
    set({ items: [] });
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalAmount: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  createOrder: async () => {
    const { items } = get();

    if (items.length === 0) {
      Swal.fire("Error", "El carrito está vacío", "error");
      return;
    }

    set({ loading: true });

    try {
      const orderData = {
        date: new Date(),
        status: OrdersStatus.PENDING,
        quantity: get().getTotalItems(),
        totalAmount: get().getTotalAmount(),
        supplier: "Cliente", // Por ahora hardcodeado
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const response = await axios.post("/orders", orderData);

      if (response.status === 201) {
        Swal.fire("¡Compra realizada!", "Tu orden ha sido creada exitosamente", "success");
        get().clear();
      }
    } catch (error) {
      console.error("Error creating order:", error);
      Swal.fire("Error", "No se pudo procesar la compra", "error");
    } finally {
      set({ loading: false });
    }
  },

  getFirstUserId: () => {
    const { items } = get();
    return items.length > 0 ? items[0].userId : undefined;
  },
}));

export default useCartStore;
