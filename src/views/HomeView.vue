<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { twMerge } from 'tailwind-merge'
import axios from 'axios';
import type { User } from '@/models/user'; 
import { useUserStore }  from '@/store/userStore';
import useSocketStore  from '@/store/socketStore';
import { storeToRefs } from 'pinia';
import UserCard from '@/components/UserCard.vue';
import type { Conversation } from '@/models/conversation';

const router = useRouter()
const userStore = useUserStore();
userStore.setCurrentUser(); 
const { currentUser }   = storeToRefs(userStore);
const socketStore = useSocketStore();
// socketStore.setCurrentUser(currentUser.value!);
console.log("----------" + socketStore.getCurrentUser()?._id);
socketStore.setCurrentUser(socketStore.getCurrentUser()!);

const headers = {
  'Authorization': sessionStorage.getItem('jwt')
}

const users = ref<User[]>([]);
const usersOnline = ref<User[]>([]);
const conversations = ref<Conversation[]>([]);

onMounted(async () => {
  // fetch users
  console.log(await axios.get('http://localhost:5000/users/all'));
  const apiUsers = await axios.get('http://localhost:5000/users/all')
  users.value = apiUsers.data.users;
  const apiUsersOnline = await axios.get('http://localhost:5000/users/online')
  usersOnline.value = apiUsersOnline.data.users;
  // fetch conversations
  console.log(await axios.get('http://localhost:5000/conversations', {headers: headers}));
  const apiConversations = await axios.get('http://localhost:5000/conversations', {headers: headers})
  conversations.value = apiConversations.data.conversations;
})

const selectedUsersIds = ref<Array<string>>([])

const createConversation = async () => {
  await axios.post('http://localhost:5000/conversations', {
    concernedUsersIds: selectedUsersIds.value
  }, {headers: headers} )
  .then(function (response) {
    console.log(response);
    socketStore.watchNewConversation((convId, conversation) => {
      // Mettez en œuvre la logique que vous souhaitez exécuter lorsque vous recevez une nouvelle conversation
      console.log(`Nouvelle conversation reçue: ${convId}`, conversation);
      console.log('CONVERSATION CREE');
      console.log('Voici l ID: ' + convId);
      // const apiConversations = await axios.get('http://localhost:5000/conversations', {headers: headers})
      // conversations.value = apiConversations.data.conversations;
      
      // Par exemple, mettez à jour l'interface utilisateur avec la nouvelle conversation
      // updateUIWithNewConversation(conversation);
      // fetchConversations();
      router.push('/see/' + convId);
    });
    router.push('/see/' + response.data.conversation._id);
    console.log("nan mais la c'est trop");
  })
  .catch(function (error) {
    console.log(error);
  });
}

// const fetchConversations = async () => {
//   try {
//     const response = await axios.get(`http://localhost:5000/conversations/`, { headers: headers });
//     conversations.value = response.data.conversations;
//   } catch (error) {
//     console.error(error);
//   }
// };

const toggleUserSelection = (userId: string) => {
  const index = selectedUsersIds.value.indexOf(userId);
  if (index !== -1) {
    // L'utilisateur est déjà sélectionné, donc le retirer de la sélection
    selectedUsersIds.value.splice(index, 1);
  } else {
    // L'utilisateur n'est pas sélectionné, donc l'ajouter à la sélection
    selectedUsersIds.value.push(userId);
  }
}

const isUserSelected = (userId: string) => {
  return selectedUsersIds.value.includes(userId);
}

function isUserOnline(user: User) {
    // Utilisez includes pour vérifier si l'utilisateur est en ligne
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
        <li v-for="conversation in conversations" style="margin: 8px 0 8px 8px; background-color: rgb(218, 215, 215); border-radius: 8px; list-style-type: none;">
          <a :href="`see/` + conversation._id"><div style="display: flex; align-items: center;">
          <img
              :src="`https://source.unsplash.com/` + currentUser?.profilePicId + `/100x100`"
              alt="User Image"
              class="w-12 h-12 rounded-full mr-4"
            />
            <div style="width: 85%;">
              <p>{{ conversation.title }}</p>
              <p v-if="conversation.messages[conversation.messages.length - 1]" style="font-style: italic;">{{ conversation.messages[conversation.messages.length - 1].content }}</p>
              <p v-else style="font-style: italic;">Démarer la conversation</p>
              <p style="text-align: right;">{{ conversation.lastUpdate }}</p>
            </div>
          </div></a>
        </li>
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
              <UserCard @click="toggleUserSelection(user._id)" :user="user" :selected="isUserSelected(user._id)" :online="isUserOnline(user)"/>
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