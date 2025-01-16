<template>
    <div class="container mx-auto mt-8 p-6 max-w-2xl">
      <div class="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 class="text-2xl font-bold text-blue-700 mb-6 text-center">Kreiraj račun</h2>
        <form @submit.prevent="handleRegister">
          <div class="mb-6">
            <label for="username" class="block text-sm font-medium text-gray-800 mb-2">
              Korisničko ime
            </label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Unesite korisničko ime"
              required
            />
          </div>
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-800 mb-2">
              Lozinka
            </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Unesite lozinku"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Registriraj se
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import axios from "axios";
  import { reactive } from "vue";
  
  const formData = reactive({
    username: "",
    password: "",
  });
  
  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:7000/users/register", {
        username: formData.username,
        password: formData.password,
      });
  
      const user_id = res.data.user_id;
      localStorage.setItem("user_id", user_id);
  
      alert("Registracija je uspješna!");
      formData.username = "";
      formData.password = "";
    } catch (err) {
      alert(
        "Neuspješna registracija: " +
          (err.response?.data?.error || err.message || "Nepoznata greška")
      );
    }
  };
  </script>
  
  <style scoped>
  .container {
    background-color: #eaf4fc;
    padding: 2rem;
    border-radius: 1rem;
  }
  
  h2 {
    font-family: "Arial", sans-serif;
  }
  
  button {
    font-weight: bold;
    letter-spacing: 0.5px;
  }
  </style>
  