<template>
  <div class="max-w-lg mx-auto p-6">
    <div class="bg-gradient-to-br from-blue-100 to-blue-300 p-8 shadow-lg rounded-xl">
      <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">Registracija</h1>
      <form @submit.prevent="register" class="space-y-6">
        <div>
          <label for="username" class="block text-lg font-medium text-gray-700 mb-2">Korisničko ime:</label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Unesite korisničko ime"
            required
          />
        </div>
        <div>
          <label for="password" class="block text-lg font-medium text-gray-700 mb-2">Lozinka:</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Unesite lozinku"
            required
          />
        </div>
        <div class="flex justify-between">
          <button
            type="submit"
            class="bg-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Registriraj se
          </button>
          <button
            type="button"
            @click="closeForm"
            class="bg-gray-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Odustani
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import api from '../services/api';
import { ref } from 'vue';

const username = ref('');
const password = ref('');
const emit = defineEmits(['close', 'loginSuccess']);

const register = async () => {
  try {
    const response = await api.post('users/register', {
      username: username.value,
      password: password.value,
    });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      alert('Uspješna registracija. Dobrodošli!');
      username.value = '';
      password.value = '';
      emit('loginSuccess');
      emit('close');
    } else {
      alert('Registracija nije uspjela, token nije primljen.' + response.data.error);
    }
  } catch (error) {
    console.log(error);
    alert('Neuspješna registracija: ' + (error.response.data?.error || error.message));
  }
};

const closeForm = () => {
  emit('close');
};
</script>

<style scoped>
body {
  background-color: #f0f9ff;
  font-family: 'Roboto', sans-serif;
}
button {
  transition: transform 0.2s, background-color 0.2s;
}
button:hover {
  transform: translateY(-2px);
}
</style>
