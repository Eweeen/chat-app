<script setup lang="ts">
import { ref } from 'vue';
import { authentification } from '@/services/auth';
import { createToken } from '@/utils/tokenUtils';
import { useRouter } from "vue-router";

const router = useRouter();
const logs = { email: undefined, password: undefined };
const errors = ref("");

async function login() {
  if (!logs.email || !logs.password) {
    errors.value = "Veuillez remplir tous les champs.";
    return;
  }

  const { data, error } = await authentification(logs.email, logs.password);

  if (error || !data) {
    return errors.value = error?.message ?? "Une erreur est survenue lors de l'authentification.";
  }

  createToken(data.token);
  await router.push("/");
}
</script>

<template>
  <div class="h-screen flex flex-col justify-center items-center">
    <form @submit.prevent="login" class="flex flex-col max-w-lg w-full gap-2">
      <h1 class="text-3xl mb-4">Connexion</h1>

      <div v-if="errors" class="alert alert-error mb-4" @click="errors = ''">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{ errors }}</span>
      </div>

      <input v-model="logs.email" type="email" placeholder="Email" class="input input-bordered w-full" />
      <input v-model="logs.password" type="password" placeholder="Password" class="input input-bordered w-full" />

      <div class="text-right text-sm">
        <span>Pas de compte ? </span>
        <RouterLink to="sign-up" class="underline">S'inscrire</RouterLink>
      </div>

      <button class="btn mt-2">Se connecter</button>
    </form>
  </div>
</template>