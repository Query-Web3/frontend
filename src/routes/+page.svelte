<script lang="ts">
  import { Button, Card, Textarea, Label } from 'flowbite-svelte';
  import { IconSend } from '@tabler/icons-svelte';
  import { onMount } from 'svelte';

  let messages: Array<{role: 'user' | 'assistant', content: string}> = [];
  let userInput = '';
  let chatContainer: HTMLElement;

  $: if (chatContainer) {
    setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 0);
  }

  function handleSubmit() {
    if (!userInput.trim()) return;
    
    messages = [...messages, { role: 'user', content: userInput }];
    const question = userInput;
    userInput = '';

    // 模拟AI响应
    setTimeout(() => {
      messages = [...messages, {
        role: 'assistant',
        content: `I understand you're asking about "${question}". I can help you query blockchain data and analyze trends. Would you like to know about transaction volumes, yields, or something else?`
      }];
    }, 1000);
  }
</script>

<div class="max-w-4xl mx-auto">
  <Card class="mb-4">
    <h1 class="text-2xl font-bold mb-4">QueryWeb3 AI Assistant</h1>
    <p class="text-gray-600 dark:text-gray-400">
      Ask me anything about blockchain data, transaction volumes, yields, and more. I'm here to help!
    </p>
  </Card>

  <div class="flex flex-col h-[600px]">
    <div 
      bind:this={chatContainer}
      class="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
    >
      {#each messages as message}
        <div class={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div
            class={`max-w-[80%] p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}
          >
            {message.content}
          </div>
        </div>
      {/each}
    </div>

    <form 
      on:submit|preventDefault={handleSubmit}
      class="flex gap-2"
    >
      <div class="flex-1">
        <Label for="userInput" class="sr-only">Message</Label>
        <Textarea
          id="userInput"
          bind:value={userInput}
          placeholder="Ask about blockchain data..."
          rows="2"
        />
      </div>
      <Button type="submit" class="self-end">
        <IconSend class="w-5 h-5" />
      </Button>
    </form>
  </div>
</div>
