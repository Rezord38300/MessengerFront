<template>
    <div
      :class="
        twMerge('w-72 bg-white border border-gray-200 rounded-lg cursor-pointer ', selected && 'border-red-400 border-4')
      "
    >
      <div class="flex flex-col items-center py-8">
        <h5 class="mb-1 text-xl font-medium text-gray-900">
          {{ title }}
        </h5>
        <p class="mb-2 text-sm text-gray-500">
          Last Seen: {{ formatDate(lastUpdate) }}
        </p>
        <p class="mb-4 text-sm text-gray-500">
          {{ getLastMessage(messages) }}
        </p>
        <!-- Other conversation details can be added here -->
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue'
  import { twMerge } from 'tailwind-merge'
  
  // Define the props for the conversation card
  const props = defineProps<{
    participants: string[]
    messages: string[]
    title: string
    lastUpdate: string
    selected: boolean
  }>()
  
  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }
  
  // Get the last message from messages array
  const getLastMessage = (messages: string[]) => {
    if (messages.length > 0) {
      return messages[messages.length - 1]
    }
    return 'No messages yet'
  }
  </script>  