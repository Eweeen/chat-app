<script setup lang="ts">
import { ref, computed, PropType } from "vue";
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption, TransitionRoot } from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import { User } from "@/interfaces/user.interface";

const props = defineProps({
  users: {
    type: Array as PropType<User[]>,
    required: true,
  },
});

const emits = defineEmits(["choose"]);

let query = ref("");

let filteredPeople = computed(() =>
  query.value === ""
    ? props.users
    : props.users.filter((person) => person.username.toLowerCase().replace(/\s+/g, '').includes(query.value.toLowerCase().replace(/\s+/g, '')))
);
</script>

<template>
  <div class="w-full">
    <Combobox>
      <div class="relative">
        <div class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md sm:text-sm">
          <ComboboxInput
            class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:outline-none"
            :displayValue="(person: any) => person.name"
            placeholder="Rechercher un utilisateur"
            @change="query = $event.target.value"
          />
          <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </ComboboxButton>
        </div>
        <TransitionRoot
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          @after-leave="query = ''"
        >
          <ComboboxOptions class="absolute mt-1 max-h-96 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg sm:text-sm">
            <div
              v-if="filteredPeople.length === 0 && query !== ''"
              class="relative cursor-default select-none py-2 px-4 text-gray-700"
            >
              Aucun utilisateur.
            </div>

            <ComboboxOption
              v-for="person in filteredPeople"
              as="template"
              :key="person.id"
              :value="person"
              v-slot="{ selected, active }"
            >
              <li
                class="relative cursor-pointer select-none py-2 pl-10 pr-4"
                :class="{ 'bg-teal-600 text-white': active, 'text-gray-900': !active }"
                @click="emits('choose', person)"
              >
                <span
                  class="block truncate"
                  :class="{ 'font-medium': selected, 'font-normal': !selected }"
                >
                  {{ person.username }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3"
                  :class="{ 'text-white': active, 'text-teal-600': !active }"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>
