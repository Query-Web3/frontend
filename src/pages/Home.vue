<template>
  <div class="home gradient-body">
    <div class="chat section section--bt tbg">
      <div class="container">
        <div class="section__title section__title--carousel">
          <h2>QueryWeb3</h2>
          <p>The most valuable BI and efficient Al-powered information service platform in the Polkadot ecosystem.</p>
        </div>
        <div class="slides">
        </div>
      </div>

      <div class="container input-container">
        <div class="input-wrapper">
          <textarea rows="3" placeholder="Ask me anything about polkadot and kusama ecosystem."></textarea>
          <div class="button-group">
            <button class="action-button" aria-label="Upload image">
              <i class="fas fa-image"></i>
            </button>
            <div class="divider" aria-hidden="true"></div>
            <button class="action-button" aria-label="Voice input">
              <i class="fas fa-microphone"></i>
            </button>
            <button class="action-button" aria-label="Send message">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="floating-container">
      <p class="floating-text" v-for="text in floatingTexts"
        :style="'font-size: ' + text.size + 'rem; left: ' + text.x + '%; top: ' + text.y + '%'">
        {{ text.text }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const texts = [
  "Composable Finance",
  "Continuum",
  "Polkadot",
  "Interlay",
  "Polkimex",
  "SORA",
  "Subsocial",
  "Acala",
  "Moonbeam",
  "Astar",
  "Parallel Finance",
  "HydraDX",
  "Phala Network",
  "Centrifuge",
  "Bifrost",
  "Equilibrium",
  "Unique Network",
];

function createFloatingText(text: string) {
  return {
    text,
    size: Math.random() * 2 + 1, // 1-3rem
    x: Math.random() * 100, // 0-100%
    y: Math.random() * 100, // 0-100%
    speed: {
      x: (Math.random() - 0.5) * 0.2, // -0.005 to 0.005
      y: (Math.random() - 0.5) * 0.2,
    },
  };
}

const animateTimeout = ref<any>(null);
const floatingTexts = ref(texts.map((text) => createFloatingText(text)));
const animate = () => {
  floatingTexts.value = floatingTexts.value.map((item) => {
    let newX = item.x + item.speed.x;
    let newY = item.y + item.speed.y;

    // Bounce off edges
    if (newX <= 0 || newX >= 100)
      item.speed.x = (Math.random() - 0.5) * 0.01;
    if (newY <= 0 || newY >= 100)
      item.speed.y = (Math.random() - 0.5) * 0.01;

    return {
      ...item,
      x: (newX + 100) % 100,
      y: (newY + 100) % 100,
    };
  });
  animateTimeout.value = setTimeout(animate, 100);
};

onMounted(() => {
  animate();
});

onUnmounted(() => {
  clearTimeout(animateTimeout.value);
});
</script>

<style lang="scss" scoped>
.home {
  padding-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.chat {
  border: none;
  max-width: 800px;
  margin: 0 auto;
  min-height: 380px;
  padding-bottom: 40px;
  padding: 0;
  padding-bottom: 100px;

  h2 {
    font-size: 60px;
    color: #fff;
    font-weight: 600;
    padding-top: 15px;
    text-align: left;
    line-height: 44px;
    text-align: center;
    margin-bottom: 30px;
  }

  p {
    font-size: 22px;
    color: #fff;
    font-weight: 400;
    margin-bottom: 36px;
    padding-top: 15px;
    text-align: left;
    line-height: 32px;
    text-align: center;
  }

  .input-container {
    .input-wrapper {
      display: flex;
      flex-direction: column;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 0.75rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    textarea {
      flex: 1;
      background: transparent;
      border: none;
      color: white;
      font-size: 1rem;
      padding: 0.5rem 1rem;
      outline: none;
      resize: none;
      min-height: 80px;
      font-family: inherit;
    }

    textarea::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    .button-group {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      justify-content: flex-end;
      margin-top: 0.5rem;
    }

    .action-button {
      background: transparent;
      border: none;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .action-button:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}

.floating-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.floating-text {
  position: absolute;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.1);
  margin: 0;
  white-space: nowrap;
  transition: all 0.1s linear;
}
</style>