import { defineStore } from "pinia";
import axios from "axios";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: JSON.parse(localStorage.getItem("cart")) || [],
  }),
  actions: {
    addToCart(product) {
      const existingItem = this.cart.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    removeFromCart(productId) {
      this.cart = this.cart.filter((item) => item.id !== productId);
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    async placeOrder(userId) {
      try {
        const totalPrice = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const { data } = await axios.post("/orders", {
          userId,
          items: this.cart,
          totalPrice,
        });

        this.cart = [];
        localStorage.removeItem("cart");
        return data.orderId;
      } catch (error) {
        throw new Error("Đặt hàng thất bại");
      }
    },
  },
  
    state: () => ({
      cart: [],
      discount: 0,
    }),
  
    actions: {
      addToCart(product) {
        this.cart.push(product);
      },
  
      async applyDiscount(code) {
        try {
          const { data } = await axios.post("/discounts/apply", { code });
          this.discount = data.discount;
        } catch (error) {
          alert(error.response.data.message);
        }
      },
  
      getTotalPrice() {
        const total = this.cart.reduce((sum, item) => sum + item.price, 0);
        return total - (total * this.discount) / 100;
      },
    },
});
