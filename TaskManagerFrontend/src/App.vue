<script setup>
import api from './services/api';
import Task from './components/Task.vue';
import Registracija from './components/registracija.vue';
import Prijava from './components/prijava.vue';
import { ref, onMounted } from "vue";

const tasks = ref([]);
const isLoggedIn = ref(false);
const showNoviTaskForm = ref(false);
const showRegistracijaForm = ref(false);
const showPrijavaForm = ref(false);
const noviTaskNaslov = ref("");
const noviTaskOpis = ref("");
const noviTaskTags = ref("");

const handleLoginSuccess = () => {
  isLoggedIn.value = true;
  fetchTasks();
};

onMounted(() => {
  if (localStorage.getItem('authToken')) {
    isLoggedIn.value = true;
    fetchTasks();
  }
});

const fetchTasks = async () => {
  try {
    const response = await api.get("/tasks");
    tasks.value = response.data;
  } catch (error) {
    console.error("Greška u dohvaćanju zadataka", error);
  }
};

const addTask = async () => {
  if (!isLoggedIn.value) {
    alert("Morate se registrirati ili prijaviti kako biste dodali zadatak");
    showNoviTaskForm.value = false;
    return;
  }
  if (!noviTaskNaslov.value.trim() || !noviTaskOpis.value.trim()) {
    alert("Naslov i opis su obavezni");
    return;
  }
  const tagsArray = noviTaskTags.value.split(",").map(tag => tag.trim());
  try {
    const response = await api.post("/tasks/novi", {
      naslov: noviTaskNaslov.value,
      opis: noviTaskOpis.value,
      tags: tagsArray
    });
    tasks.value.unshift(response.data);
    resetTaskForm();
    showNoviTaskForm.value = false;
  } catch (error) {
    console.error("Greška u dodavanju zadatka", error);
  }
}; 

const resetTaskForm = () => {
  noviTaskNaslov.value = "";
  noviTaskOpis.value = "";
  noviTaskTags.value = "";
};

const ukloniZadatak = (id) => {
  tasks.value = tasks.value.filter(task => task._id.toString() !== id);
};

const logout = () => {
  localStorage.removeItem('authToken');
  isLoggedIn.value = false;
  tasks.value = [];
  showPrijavaForm.value = false;
  showRegistracijaForm.value = false;
  showNoviTaskForm.value = false;
};

</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <!-- Header -->
    <header class="flex flex-col items-center bg-blue-500 p-6 shadow-lg rounded-md mb-6">
      <h1 class="text-3xl font-bold text-white">Task Manager</h1>
      <p class="text-white mt-2" v-if="!isLoggedIn">Molimo prijavite se ili registrirajte kako biste mogli dodavati zadatke.</p>
      <div class="mt-4">
        <button
          v-if="isLoggedIn"
          @click="showNoviTaskForm = true"
          class="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-all">
          Dodaj zadatak
        </button>
        <button
          v-if="!isLoggedIn"
          @click="showRegistracijaForm = !showRegistracijaForm"
          class="ml-2 bg-blue-200 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-300 transition-all">
          Registriraj se
        </button>
        <button
          v-if="!isLoggedIn"
          @click="showPrijavaForm = !showPrijavaForm"
          class="ml-2 bg-blue-200 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-300 transition-all">
          Prijavi se
        </button>
        <button
          v-if="isLoggedIn"
          @click="logout"
          class="ml-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all">
          Odjava
        </button>
      </div>
    </header>

    <!-- Registration Form -->
    <Registracija
      v-if="showRegistracijaForm && !isLoggedIn"
      @close="showRegistracijaForm = false"
      @loginSuccess="handleLoginSuccess" />

    <!-- Login Form -->
    <Prijava
      v-if="showPrijavaForm && !isLoggedIn"
      @close="showPrijavaForm = false"
      @loginSuccess="handleLoginSuccess" />

    <!-- New Task Form -->
    <div v-if="showNoviTaskForm" class="bg-white p-4 shadow-lg rounded-md mb-6">
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2">Naslov zadatka:</label>
        <input v-model="noviTaskNaslov" type="text" class="w-full px-3 py-2 border rounded-md shadow-sm" />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2">Opis zadatka:</label>
        <textarea v-model="noviTaskOpis" rows="3" class="w-full px-3 py-2 border rounded-md shadow-sm"></textarea>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2">Tagovi (odvojeni zarezom):</label>
        <input v-model="noviTaskTags" type="text" class="w-full px-3 py-2 border rounded-md shadow-sm" />
      </div>
      <div class="flex space-x-4">
        <button @click="addTask" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Spremi</button>
        <button @click="showNoviTaskForm = false" class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Odustani</button>
      </div>
    </div>

    <!-- Task List -->
    <div class="bg-white p-4 shadow-lg rounded-md">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Vaši zadaci</h2>
      <ul class="space-y-4">
        <Task
          v-for="task in tasks"
          :key="task._id.toString()"
          :id="task._id.toString()"
          :naslov="task.naslov"
          :opis="task.opis"
          :tags="task.tags"
          :zavrsen="task.zavrsen"
          @obrisiZadatak="ukloniZadatak" />
      </ul>
    </div>
  </div>
</template>
