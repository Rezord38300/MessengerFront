import { io, Socket } from 'socket.io-client'
import type { User } from '@/models/user'
import type { Message } from '@/models/message'
import type { Conversation } from '@/models/conversation'
import { defineStore } from 'pinia'
import { reactive , ref } from 'vue'


export const useUserStore = defineStore('userStore', () => {
    const currentUser = ref<User>()

    function setCurrentUser(user: User){
      currentUser.value = user;
    } 

    return{
      currentUser,
      setCurrentUser
    } 
  })
