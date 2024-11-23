<script setup lang="ts">
import { PropType, onBeforeMount, ref } from "vue";
import { logout } from "@/services/auth";
import { useStore } from "@/stores";
import { useRouter } from "vue-router";
import Combobox from "./Combobox.vue";
import { User } from "@/interfaces/user.interface";
import { getConversations } from "@/services/chat";
import { storeToRefs } from "pinia";
import { Chat } from "@/interfaces/chat.interface";
import ConversationCard from "./ConversationCard.vue";

const props = defineProps({
  users: {
    type: Array as PropType<User[]>,
    required: true
  },
  selectedUser: {
    type: Object as PropType<User | null>
  }
});

const emits = defineEmits(["choose"]);

const store = useStore();
const router = useRouter();

const conversations = ref<Chat[]>([]);

onBeforeMount(async () => {
  const { data, error } = await getConversations(store.user.getId);
  if (error || !data) return;
  conversations.value = data;
});

function find(user: User) {
  emits("choose", user);
}

async function disconnect() {
  await logout();
  store.user.logout();
  router.push({ name: "login" });
}
</script>

<template>
  <header class="fixed bg-gray-300 h-screen w-80 flex flex-col p-6">
    <div class="h-[calc(100%-64px)]">
      <Combobox :users="users" class="mb-4" @choose="find" />

      <div class="h-[calc(100%-52px)] flex flex-col gap-1 overflow-y-auto">
        <ConversationCard
          v-for="c of conversations"
          :key="c.id"
          :chat="c"
          :selectedUser="selectedUser"
          @choose="find"
        />
      </div>
    </div>

    <div class="flex-1"></div>

    <button class="w-full btn" @click="disconnect">Déconnexion</button>
  </header>
</template>
