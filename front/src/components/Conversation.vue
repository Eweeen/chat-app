<script setup lang="ts">
import { User } from "@/interfaces/user.interface";
import {
  PropType,
  inject,
  onBeforeMount,
  onMounted,
  onUnmounted,
  onUpdated,
  ref,
  watch
} from "vue";
import { PaperAirplaneIcon } from "@heroicons/vue/20/solid";
import { getMessages, sendChat } from "@/services/chat";
import { useStore } from "@/stores";
import { storeToRefs } from "pinia";
import { Chat } from "@/interfaces/chat.interface";
import Message from "./Message.vue";
import { Socket } from "socket.io-client";

const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true
  }
});

const emits = defineEmits(["create"]);

const store = useStore();
const socket = inject<Socket>("socket");

const chat = ref<HTMLDivElement | null>(null);
const message = ref("");
const messages = ref<Chat[]>([]);

onBeforeMount(async () => {
  const { data, error } = await getMessages(store.user.getId, props.user.id);
  if (error || !data) return;
  messages.value = data;
});

onUpdated(() => {
  scrollToBottom();
});

onMounted(() => {
  socket?.emit("joinRoom", `${store.user.getId}-${props.user.id}`);
});

onUnmounted(() => {
  socket?.emit("leaveRoom", `${store.user.getId}-${props.user.id}`);
});

socket?.on("message", (message: any) => {
  messages.value.push(message); // Mettre à jour la liste des messages reçus
  scrollToBottom("smooth");
});

function scrollToBottom(smooth?: "smooth") {
  if (chat.value) {
    chat.value.scrollTo({
      top: chat.value.scrollHeight,
      behavior: smooth ?? "instant"
    });
  }
}

async function send() {
  if (message.value === "") return;
  const { data, error } = await sendChat(message.value, store.user.getId, props.user.id);
  if (error || !data) return;

  messages.value.push(data);
  emits("create", data);
  message.value = "";
  scrollToBottom("smooth");
}

watch(
  () => props.user,
  async (newUser, oldUser) => {
    socket?.emit("leaveRoom", `${store.user.getId}-${oldUser.id}`);
    socket?.emit("joinRoom", `${store.user.getId}-${newUser.id}`);

    const { data, error } = await getMessages(store.user.getId, newUser.id);
    if (error || !data) return;
    messages.value = data;
  }
);
</script>

<template>
  <main class="h-full ml-80">
    <header class="h-20 bg-gray-400 flex items-center gap-3 p-4">
      <img src="@/assets/default.png" alt="default user picture" class="rounded-full w-10 h-10" />
      <h1 class="text-xl font-semibold text-white">{{ user.username }}</h1>
    </header>

    <div ref="chat" class="h-[calc(100%-160px)] p-3 overflow-y-auto">
      <Message v-for="m of messages" :key="m.id" :message="m" />
    </div>

    <footer class="h-20 bg-gray-400 flex items-center gap-3 p-4">
      <input
        v-model="message"
        type="text"
        placeholder="Message..."
        class="input input-bordered w-full"
        @focus="scrollToBottom('smooth')"
      />
      <button class="btn" @click="send">
        <PaperAirplaneIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
      </button>
    </footer>
  </main>
</template>
