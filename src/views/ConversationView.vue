<script setup lang="ts">
import type { Conversation } from '@/models/conversation';
import axios from 'axios';
import { onMounted, ref, type FormHTMLAttributes, computed } from 'vue';
import { useRoute } from 'vue-router';
import useSocketStore  from '@/store/socketStore';
import type { Message } from '@/models/message';
import { useUserStore }  from '@/store/userStore';
import { storeToRefs } from 'pinia';

const route = useRoute();
// const conversationId = computed<string>(() => {
//     return route.params.conversationId;
// });
const props = defineProps<{
  conversationId?: string
}>()

const socketStore = useSocketStore();

const headers = {
  'Authorization': sessionStorage.getItem('jwt')
}

const conversations = ref<Conversation[]>([]);
const conversation = ref<Conversation>();
const messageContent = ref<string>();
const userStore = useUserStore();
// userStore.setCurrentUser();
const { currentUser } = storeToRefs(userStore);
const testUser = socketStore.getCurrentUser();

console.log("----------" + socketStore.getCurrentUser()?._id);
console.log("----------" + userStore.currentUser);

onMounted(async () => {
  console.log(await axios.get('http://localhost:5000/conversations', {headers: headers}));
  const apiConversations = await axios.get('http://localhost:5000/conversations', {headers: headers})
  conversations.value = apiConversations.data.conversations;
  conversation.value = conversations.value.find(conversation => conversation._id == props.conversationId);
  socketStore.login(testUser!);
  console.log(testUser);
  socketStore.watchNewMessage((conversationId: string, message: Message) => {console.log("hello")});
})

const submitForm = async () => {
 
  // axios.post("http://localhost:5000/conversations/"+props.conversationId, {
  //   "messageContent": messageContent.value
  // }, {headers: headers} ).then(function (response) {
  //   console.log(response.data);
  //   var test = document.getElementById("bla");
  //   test?.reset();
  //   // fetchMessages();
  //   // socketStore.login(userStore.currentUser!);
    
  //   console.log("new message")
  //   // socketStore.watchNewMessage((conversationId: string, message: Message) => {
  //   //   console.log(`Nouvelle conversation reçue: ${conversationId}`, message);
  //   //   // fetchMessages();
  //   //   // const response = await axios.get(`http://localhost:5000/conversations/${props.conversationId}`, { headers: headers });
  //   //   // conversation.value = response.data;
  //   //   console.log('hello i am a new message');
  //   // });
  // })
  // .catch(function (error) {
  //   console.log(error);
  // });

  
  axios.post("http://localhost:5000/conversations/"+props.conversationId, {
    "messageContent": messageContent.value
  }, {headers: headers} ).then(async function (response) {
    console.log(response.data);
    var test = document.getElementById("bla");
    test?.reset();
    await fetchMessages();
    console.log("new message");
  })
  .catch(function (error) {
    console.log(error);
  });


}

const fetchMessages = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/conversations/${props.conversationId}`, { headers: headers });
    conversation.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

const currentConversationMessages = computed(() => {
  return conversation.value ? conversation.value.messages : [];
});
</script>

<template>

<main class="h-screen">
    <div class="flex flex-row h-screen">
      <div class="flex-col w-1/3 max-w-[500px]">
        <div class="bg-white p-4 shadow-md rounded-lg h-[100px]">
          <div class="flex items-center">
            <img
              :src="`https://source.unsplash.com/` + 'test' + `/100x100`"
              alt="User Image"
              class="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h2 class="text-2xl font-bold">{{ currentUser?.username }}</h2>
              <span class="text-green-500">Online</span>
            </div>
          </div>
        </div>
        <li v-for="conversation in conversations" style="margin: 8px 0 8px 8px; background-color: rgb(218, 215, 215); border-radius: 8px; list-style-type: none;">
          <a :href="conversation._id"><div style="display: flex; align-items: center;">
          <img
              :src="`https://source.unsplash.com/` + 'test' + `/100x100`"
              alt="User Image"
              class="w-12 h-12 rounded-full mr-4"
            />
            <div style="width: 85%;">
              <p>{{ conversation.title }}</p>
              <p v-if="conversation.messages[conversation.messages.length - 1]" style="font-style: italic;">{{ conversation.messages[conversation.messages.length - 1].content }} </p>
              <p v-else style="font-style: italic;">Démarer la conversation</p>
              <p style="text-align: right;">{{ conversation.lastUpdate }}</p>
            </div>
          </div></a>
        </li>
        <!-- liste de conversations -->
      </div>
      <div class="w-2/3 h-full px-4">
        <!-- <p>{{conversationId}} </p> -->
        {{ currentConversationMessages }}
        <p v-for="message in conversation?.messages">{{ message.content }} </p>
        <form @submit.prevent="submitForm" id="bla">
          <div class="mb-4">
            <label for="message" class="block text-gray-700 font-bold mb-2">Message</label>
            <input
              type="text"
              v-model="messageContent"
              id="message"
              name="message"
              class="w-full border rounded py-2 px-3"
              required
            />
          </div>
        
            <div class="text-center">
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>

</template>