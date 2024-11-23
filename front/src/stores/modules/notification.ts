import { defineStore } from "pinia";

let uuid = 0;
class ToastMessage {
  type: "info" | "danger" | "warning" | "success";
  title: string;
  message: string;
  duration: number;
  uuid: number;
  timer: any;

  constructor(
    type: "info" | "danger" | "warning" | "success",
    title: string,
    message: string,
    duration?: number
  ) {
    this.type = type;
    this.title = title;
    this.message = message;
    this.duration = duration || 3000;
    this.uuid = uuid++;

    this.timer = setTimeout(() => {
      this.remove();
    }, this.duration);
  }
  remove() {
    useToastStore().remove(this.uuid);
  }
}

const useToastStore = defineStore("notification", {
  state: () => ({
    messages: [] as ToastMessage[]
  }),
  actions: {
    push(
      type: "info" | "danger" | "warning" | "success",
      title: string,
      message: string,
      duration?: number
    ) {
      this.messages.push(new ToastMessage(type, title, message, duration));
    },
    remove(uuid: number) {
      this.messages.splice(
        this.messages.findIndex((t) => t.uuid === uuid),
        1
      );
    }
  }
});

const newToast = (
  type: "info" | "danger" | "warning" | "success",
  title: string,
  message: string,
  duration?: number
) => {
  useToastStore().push(type, title, message, duration);
};

export { useToastStore, newToast };
