<script setup>
import api from '../services/api';
import TaskTag from "./TaskTag.vue";
import { ref } from "vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  naslov: {
    type: String,
    required: true,
  },
  opis: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    required: true,
  },
  zavrsen: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["obrisiZadatak"]);
const isZavrsen = ref(props.zavrsen);
const oznaciZavrsen = async () => {
  try {
    const response = await api.patch(`/tasks/${props.id}`, { zavrsen: true });
    if (response.status === 200) {
      console.log("Označen kao dovršen");
      isZavrsen.value = true;
    } else {
      console.error("Greška u ažuriranju");
    }
  } catch (error) {
    console.error("Greška", error);
  }
};
const obrisiZadatak = async () => {
  if (!confirm("Želite li obrisati zadatak?")) return;

  try {
    const response = await api.delete(`/tasks/${props.id}`);
    if (response.status === 200) {
      console.log("Zadatak obrisan");
      emit("obrisiZadatak", props.id);
    } else {
      console.error("Greška u brisanju zadatka");
    }
  } catch (error) {
    console.error("Greška", error);
  }
};
</script>

<template>
  <li
    :class="['flex flex-col p-6 rounded-lg shadow-lg transition-all', isZavrsen ? 'bg-green-100 border-l-4 border-green-500' : 'bg-gray-50 border-l-4 border-gray-300']"
  >
    <div class="mb-3">
      <p class="text-xl font-semibold text-gray-800">{{ naslov }}</p>
      <p class="text-sm text-gray-600">{{ opis }}</p>
    </div>
    <div class="flex flex-wrap space-x-2 mb-3">
      <TaskTag v-for="(tag, index) in tags" :key="index" :tag="tag" />
    </div>
    <div class="flex space-x-3">
      <button
        v-if="!isZavrsen"
        @click="oznaciZavrsen"
        class="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition-all"
      >
        Dovršeno
      </button>
      <button
        @click="obrisiZadatak"
        class="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition-all"
      >
        Obriši
      </button>
    </div>
  </li>
</template>

<style scoped>
li {
  transition: transform 0.2s, background-color 0.3s;
}
li:hover {
  transform: translateY(-3px);
  background-color: #d4e7f6;
}
</style>
