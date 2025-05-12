<script lang="ts">
  import { onMount } from "svelte";

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

  let floatingTexts: ReturnType<typeof createFloatingText>[] = $state([]);

  function createFloatingText(text: string) {
    return {
      text,
      size: Math.random() * 2 + 1, // 1-3rem
      x: Math.random() * 100, // 0-100%
      y: Math.random() * 100, // 0-100%
      speed: {
        x: (Math.random() - 0.5) * 0.01, // -0.005 to 0.005
        y: (Math.random() - 0.5) * 0.01,
      },
    };
  }

  onMount(() => {
    floatingTexts = texts.map((text) => createFloatingText(text));

    const animate = () => {
      floatingTexts = floatingTexts.map((item) => {
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
      requestAnimationFrame(animate);
    };

    animate();
  });
</script>

<div class="floating-container">
  {#each floatingTexts as item}
    <p
      class="floating-text"
      style="
        font-size: {item.size}rem;
        left: {item.x}%;
        top: {item.y}%;
      "
    >
      {item.text}
    </p>
  {/each}
</div>

<div class="gradient-bg">
  <div class="content">
    <h1>QueryWeb3</h1>
    <p>
      The most valuable BI and efficient Al-powered information service platform
      in the Polkadot ecosystem.
    </p>
  </div>
</div>

<div class="input-container">
  <div class="input-wrapper">
    <textarea
      rows="3"
      placeholder="Ask me anything about polkadot and kusama ecosystem."
    ></textarea>
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

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
  />
</svelte:head>

<style>
  .gradient-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(to bottom right, #000000, #080868, #0472be);
    z-index: -1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content {
    text-align: center;
    color: white;
    padding: 2rem;
    max-width: 800px;
  }

  h1 {
    font-size: 3.5rem;
    margin-bottom: 1.5rem;
    font-weight: bold;
  }

  p {
    font-size: 1.25rem;
    line-height: 1.6;
    opacity: 0.9;
  }

  .input-container {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 800px;
  }

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

  .divider {
    width: 1px;
    height: 24px;
    background: rgba(255, 255, 255, 0.2);
    margin: 0 0.5rem;
    align-self: center;
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
