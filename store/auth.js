import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    async login(credentials) {
      try {
        const { data } = await axios.post("/auth/login", credentials);
        this.user = data.user;
        this.token = data.token;
        localStorage.setItem("user", JSON.stringify(this.user));
        localStorage.setItem("token", this.token);
      } catch (error) {
        throw new Error("Đăng nhập thất bại");
      }
    },
    async register(userInfo) {
      try {
        await axios.post("/auth/register", userInfo);
        return true;
      } catch (error) {
        throw new Error("Đăng ký thất bại");
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    loadUser() {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");
      if (savedUser && savedToken) {
        this.user = JSON.parse(savedUser);
        this.token = savedToken;
      }
    },
  },
});
