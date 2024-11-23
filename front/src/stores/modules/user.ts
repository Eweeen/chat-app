import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: {
      id: undefined,
      username: undefined,
      email: undefined,
    }
  }),
  getters: {
    getUser(state: any) {
      return state.user;
    },
    getId(state: any) {
      return state.user.id;
    },
    getUsername(state: any): string {
      return state.user.lastname;
    },
    getEmail(state: any): string {
      return state.user.email;
    },
    isMobile(): boolean {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    }
  },
  actions: {
    login(user: any) {
      this.user = {
        id: user?.id,
        username: user?.username,
        email: user?.email,
      };
    },
    refresh(user: any) {
      this.user = {
        id: user?.id,
        username: user?.username,
        email: user?.email,
      };
    },
    logout() {
      this.user = {
        id: undefined,
        username: undefined,
        email: undefined,
      };
    }
  }
});

export default useUserStore;
