<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
import Conversation from "@/components/Conversation.vue";
import { User } from "@/interfaces/user.interface";
import { findAll } from "@/services/user";
import { useStore } from "@/stores";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const store = useStore();
const users = ref<User[]>([]);

const selectedUser = ref<User | null>(null);

onBeforeMount(async () => {
  const { data, error } = await findAll();
  if (error || !data) return;
  users.value = data.filter((user) => user.id !== store.user.getId);
});

function choose(user: User) {
  selectedUser.value = user;
}
</script>

<template>
  <Navbar :users="users" :selectedUser="selectedUser" @choose="choose" />

  <Conversation v-if="selectedUser" :user="selectedUser" />
</template>
