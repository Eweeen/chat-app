<script setup lang="ts">
import { Chat } from "@/interfaces/chat.interface";
import { PropType, computed, ref } from "vue";
import { format } from "date-fns/format";
import { useStore } from "@/stores";
import { storeToRefs } from "pinia";

const props = defineProps({
  message: {
    type: Object as PropType<Chat>,
    required: true
  }
});

const store = useStore();

const isSender = computed(() => props.message.sender.id === store.user.getId);
</script>

<template>
  <div class="chat" :class="{ 'chat-start': !isSender, 'chat-end': isSender }">
    <div class="chat-image avatar">
      <div class="rounded-full w-10 h-10">
        <img src="@/assets/default.png" alt="default user picture" />
      </div>
    </div>
    <div class="chat-bubble">{{ message.content }}</div>
    <div class="chat-footer opacity-50">
      <span class="chat-time">{{ format(new Date(message.createdAt), "HH:mm") }}</span>
    </div>
  </div>
</template>
