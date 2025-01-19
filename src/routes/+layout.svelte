<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
  import '../app.css';
</script>

<Navbar let:hidden let:toggle>
  <NavBrand href="/">
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
      QueryWeb3
    </span>
  </NavBrand>
  <NavHamburger on:click={toggle} />
  <NavUl {hidden}>
    <NavLi href="/">AI Chat</NavLi>
    <NavLi href="/vol-txns">Vol & Txns</NavLi>
    <NavLi href="/yield">Yield</NavLi>
  </NavUl>
</Navbar>

<main class="container mx-auto px-4 py-8">
  <slot />
</main>
