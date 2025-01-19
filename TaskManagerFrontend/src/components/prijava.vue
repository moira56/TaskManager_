<template>
  <div class="max-w-lg mx-auto p-6">
    <div class="bg-gradient-to-br from-purple-100 to-purple-300 p-8 shadow-lg rounded-xl">
      <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">Prijava</h1>
      <form @submit.prevent="login" class="space-y-6">
        <!-- Username Input -->
        <div>
          <label for="loginUsername" class="block text-lg font-medium text-gray-700 mb-2">Korisničko ime:</label>
          <input
            id="loginUsername"
            v-model="username"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Unesite korisničko ime"
            required
          />
        </div>

        <!-- Password Input -->
        <div>
          <label for="loginPassword" class="block text-lg font-medium text-gray-700 mb-2">Lozinka:</label>
          <input
            id="loginPassword"
            v-model="password"
            type="password"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Unesite lozinku"
            required
          />
        </div>

        <!-- Buttons -->
        <div class="flex justify-between">
          <button
            type="submit"
            class="bg-purple-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Prijavi se
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

const login = async () => {
  try {
    const response = await api.post('users/login', {
      username: username.value,
      password: password.value,
    });

    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      alert('Prijava uspješna. Dobrodošli!');
      emit('loginSuccess');
      emit('close');
    } else {
      alert('Prijava nije uspjela, token nije primljen.');
    }
  } catch (error) {
    console.error('Greška pri prijavi:', error.response?.data || error.message);
    alert('Neuspješna prijava: ' + (error.response?.data?.error || error.message));
  }
};

const closeForm = () => {
  emit('close');
};
</script>

<style scoped>
body {
  background-color: #f9f5ff;
  font-family: 'Roboto', sans-serif;
}

button {
  transition: transform 0.2s, background-color 0.2s;
}

button:hover {
  transform: translateY(-2px);
}
</style>
