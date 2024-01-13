import { io, Socket } from 'socket.io-client'
import type { User } from '@/models/user'
import type { Message } from '@/models/message'
import type { Conversation } from '@/models/conversation'
import { defineStore } from 'pinia'
import { reactive , ref } from 'vue'


export const useUserStore = defineStore('userStore', () => {
    const currentUser = ref<User>()

    function setCurrentUser(){
      let newUser: User = {
        _id: "0",
        username: "0",
        password: "0",
        profilePicId: "0",
        lastConnected: new Date(),
      };
      newUser.username = sessionStorage.getItem("username") as string
      newUser.profilePicId = sessionStorage.getItem("ImageId") as string
      console.log("user storage : " + newUser.username)
      if (newUser.username != null){
        currentUser.value = newUser;
      }   
    } 

    return{
      currentUser,
      setCurrentUser
    } 
  })
