<template>
    <div class="container mx-auto mt-8 p-6 max-w-3xl">
      <div class="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Registracija korisnika</h2>
        <form @submit.prevent="handleRegister">
          <div class="mb-5">
            <label for="username" class="block text-sm font-medium text-gray-700">Korisničko ime</label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div class="mb-5">
            <label for="password" class="block text-sm font-medium text-gray-700">Lozinka</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Registriraj se
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios';
  import { reactive } from 'vue';
  
  const formData = reactive({
    username: '',
    password: '',
  });
  
  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:7000/users/register', {
        username: formData.username,
        password: formData.password,
      });
      alert('Registracija je uspješna!');
      formData.username = '';
      formData.password = '';
    } catch (err) {
      alert('Pogreška pri registraciji: ' + err.response?.data?.error || 'Nepoznata greška');
    }
  };
  </script>
  
  <style scoped>
  .container {
    background-color: #f8fafc;
  }
  </style>