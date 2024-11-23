<script setup lang="ts">
import { Chat } from "@/interfaces/chat.interface";
import { User } from "@/interfaces/user.interface";
import { useStore } from "@/stores";
import { storeToRefs } from "pinia";
import { PropType, computed } from "vue";

const props = defineProps({
  chat: {
    type: Object as PropType<Chat>,
    required: true
  },
  selectedUser: {
    type: Object as PropType<User | null>
  }
});

const emits = defineEmits(["choose"]);

const store = useStore();

const user = computed(() => {
  if (props.chat.sender.id === store.user.getId) return props.chat.receiver;
  return props.chat.sender;
});
const userLabel = computed(() => {
  if (props.chat.sender.id === store.user.getId) return "Vous";
  return props.chat.sender.username;
});
const isSelected = computed(() => props.selectedUser?.id === user.value.id);
</script>

<template>
  <div
    class="cursor-pointer flex items-center gap-3 px-3 py-2 rounded-md"
    :class="{
      'shadow bg-gray-500 hover:bg-gray-400': isSelected,
      'bg-gray-200 hover:bg-gray-100': !isSelected
    }"
    @click="emits('choose', user)"
  >
    <img src="@/assets/default.png" alt="default user picture" class="rounded-full w-8 h-8" />

    <div>
      <p :class="{ 'text-gray-900': isSelected }">{{ user.username }}</p>
      <p :class="['text-sm', { 'text-gray-100': isSelected, 'text-gray-500': !isSelected }]">
        {{ `${userLabel}: ${chat.content}` }}
      </p>
    </div>
  </div>
</template>
