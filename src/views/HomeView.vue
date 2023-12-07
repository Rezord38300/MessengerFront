<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { twMerge } from 'tailwind-merge'
import axios from 'axios';
import type { User } from '@/models/user'; 
import { useUserStore }  from '@/store/userStore';
import { storeToRefs } from 'pinia';
import UserCard from '@/components/UserCard.vue';

const router = useRouter()
const userStore = useUserStore();
const { currentUser }   = storeToRefs(userStore);

const users = ref<User[]>([]);
const usersOnline = ref<User[]>([]);

onMounted(async () => {
  // fetch users
  console.log(await axios.get('http://localhost:5000/users/all'));
  const apiUsers = await axios.get('http://localhost:5000/users/all')
  users.value = apiUsers.data.users;
  const apiUsersOnline = await axios.get('http://localhost:5000/users/online')
  usersOnline.value = apiUsersOnline.data.users;
  // fetch conversations
})

const selectedUsersIds = ref<Array<string>>([])

const createConversation = async () => {
}

function isUserOnline(user: User) {
      // Utilisez includes pour vérifier si l'utilisateur est en ligne
      // console.log(usersOnline.value.some(onlineUser => onlineUser._id === user._id));
      return usersOnline.value.some(onlineUser => onlineUser._id === user._id)
}
</script>

<template>
  <main class="h-screen">
    <div class="flex flex-row h-screen">
      <div class="flex-col w-1/3 max-w-[500px]">
        <div class="bg-white p-4 shadow-md rounded-lg h-[100px]">
          <div class="flex items-center">
            <img
              :src="`https://source.unsplash.com/` + currentUser?.profilePicId + `/100x100`"
              alt="User Image"
              class="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h2 class="text-2xl font-bold">{{currentUser?.username}}</h2>
              <span class="text-green-500">Online</span>
            </div>
          </div>
        </div>

        <!-- liste de conversations -->
      </div>
      <div class="w-2/3 h-full px-4">
        <template v-if="true"> <!-- v if pas de conversation selectionnee -->
          <h2 class="font-bold text-3xl p-2">Users</h2>
          <button
            :disabled="!selectedUsersIds.length"
            @click="createConversation"
            :class="twMerge(
              'py-2 px-4 my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded',
              !selectedUsersIds.length && 'bg-blue-400 cursor-not-allowed hover:bg-blue-400'
            )">
            Create conversation
          </button>
          <div class="flex flew-row flex-wrap gap-2">
            <!-- liste des utilisateurs -->
            <template
              v-for="user in users"
            >
              <UserCard :user="user" :selected="false" :online="isUserOnline(user)"/>
            </template>
          </div>
        </template>
        <!-- vue d'une conversation -->
        <template v-else>
            Conversation
        </template>
      </div>
    </div>
  </main>
</template>
