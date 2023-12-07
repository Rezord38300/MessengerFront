<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="w-[600px] bg-white p-8 shadow-md rounded-lg">
      <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label for="username" class="block text-gray-700 font-bold mb-2">Username</label>
          <input
            type="text"
            v-model="username"
            id="username"
            name="username"
            class="w-full border rounded py-2 px-3"
            required
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-gray-700 font-bold mb-2">Password</label>
          <input
            type="password"
            v-model="password"
            id="password"
            name="password"
            class="w-full border rounded py-2 px-3"
            required
          />
        </div>
        <p v-if="!disableButton" style="color: red; font-weight: bold;">
            Login ou Mot de passe invalide
        </p>
        <p v-if="incorrectPassword" style="color: red; font-weight: bold;">
            Mot de passe incorrect
        </p>
        <div class="text-center">
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300 disabled:cursor-not-allowed"
            :disabled="!disableButton"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from "axios"
import useSocketStore from '@/store/socketStore';
import { useUserStore } from '@/store/userStore';

const router = useRouter()
const incorrectPassword = ref(false)

const username = ref('')
const password = ref<string>("")

const disableButton = computed(() => {
  return password.value.length >= 5 && password.value.length <=15 && username.value.length > 0;
})

const submitForm = async () => {
  const socketStore = useSocketStore();
  const userStore = useUserStore();
 
  axios.post("http://localhost:5000/users/login", {
    "username": username.value,
    "password": password.value
  } ).then(function (response) {
    console.log(response.data);
    userStore.setCurrentUser(response.data.user); 
    socketStore.login(response.data.user);
    sessionStorage.setItem("jwt", response.data.token)
    router.push("/");
  })
  .catch(function (error) {
    console.log(error);
    incorrectPassword.value = true;
  });

}
</script>


