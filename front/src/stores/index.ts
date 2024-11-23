import { defineStore } from "pinia";
import { useUserStore } from "./modules/user";
import { useToastStore } from "./modules/notification";

export const useStore = defineStore("store", () => {
  const user = useUserStore();
  const toast = useToastStore();

  return { user, toast };
});
