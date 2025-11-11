<template>
  <header class="header" :style="{ background: 'rgba(8, 8, 30, ' + (bg / 100 - 0.2) + ')' }">
    <div class="header__content container">
      <!-- btn -->
      <button v-if="group == 'main'" :class="'header__btn  block md:hidden ' + (isActivce ? 'header__btn--active' : '')"
        type="button" @click="toggleMenu()">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <!-- end btn -->

      <!-- logo -->
      <div v-if="group == 'main'" class="header__logo" @click="home()">
        <!-- <img src="/imgs/TTE.svg" /> -->
        Web3 Query
      </div>
      <!-- end logo -->

      <!-- logo -->
      <div v-if="group != 'main'" class="header_back_logo flex items-center" @click="home()">
        <i class="iconfont">&#xe602;</i>
        <img src="/imgs/TTE.svg" />
        <!-- img v-if="group == 'lanch'" src="/imgs/logo-lanch.svg" /-->
      </div>
      <!-- end logo -->

      <div class="space"></div>

      <!-- navigation -->
      <ul v-if="group == 'main'" :class="'header__nav ' + (isActivce ? 'header__nav--active' : '')">
        <li :class="path == '/chat' || path == '' || path == '/' ? 'active' : ''">
          <RouterLink to="/">AI Chat
            <!-- <i class="iconfont">&#xe68f;</i> -->
          </RouterLink>
        </li>
        <!-- <li :class="path == '/txns' ? 'active' : ''">
          <RouterLink class="trans" tkey="nav_contact" to="/txns">Vol & Txns</RouterLink>
        </li> -->
        <li :class="path == '/yield' ? 'active' : ''">
          <RouterLink class="trans" tkey="nav_contact" to="/yield">Yield</RouterLink>
        </li>
      </ul>
      <!-- end navigation -->

      <!-- lanch navigation -->
      <ul v-if="group == 'lanch'" :class="'header__nav ' + (isActivce ? 'header__nav--active' : '')">
        <li :class="path == '/' ? 'active' : ''">
          <RouterLink to="/">AI Chat
            <!-- <i class="iconfont">&#xe68f;</i> -->
          </RouterLink>
        </li>
        <!-- <li :class="path == '/txns' ? 'active' : ''">
          <RouterLink class="trans" tkey="nav_contact" to="/txns">Vol & Txns</RouterLink>
        </li> -->
        <li :class="path == '/yield' ? 'active' : ''">
          <RouterLink class="trans" tkey="nav_contact" to="/yield">yield</RouterLink>
        </li>
      </ul>
      <!-- end lanch navigation -->
    </div>
  </header>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useNotification } from 'naive-ui'
import { useGlobalStore } from '@/stores/global';
import useGlobelProperties from '@/plugins/globel';
import router from '@/router';

const userStore = useGlobalStore()
const notification = useNotification()
const bg = ref(0)

const group = ref("main")

const getPath = (paths: any) => {
  group.value = "main"
  if (paths.length === 0) return '/'

  const lpath = paths[paths.length - 1]
  if (lpath.meta && lpath.meta.group) {
    group.value = lpath.meta.group
  }

  return paths[paths.length - 1].path
}
const path = ref(getPath(userStore.paths))
const userInfo = ref(userStore.userInfo)
const isActivce = ref(false)
const global = useGlobelProperties()


window.$app = global;
window.$notification = notification;
global.$notification = notification;


const toggleMenu = () => {
  isActivce.value = !isActivce.value
}

userStore.$subscribe((mutation, state) => {
  path.value = getPath(state.paths)
  userInfo.value = state.userInfo
  isActivce.value = false
}, { detached: true })

const home = () => {
  router.push("/")
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
})

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  console.log("scrollTop", scrollTop);
  if (scrollTop > 40) {
    bg.value = 100
  } else {
    bg.value = 0
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 9;
  background: rgba(0, 0, 0, 1);
  // border-bottom: 1px solid #060e3a;
  border-bottom: 1px solid #354dcd33;
}


.header__content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 72px;

  .header__logo {
    width: auto;
    height: 34px;
    line-height: 32px;
    align-items: center;
    margin-left: 0px;
    margin-right: 10px;
    cursor: pointer;
    font-size: 28px;
    font-weight: bold;
    font-family: "letter-font";
  }

  .header_back_logo {
    width: auto;
    height: 38px;
    align-items: center;
    margin-left: 4px;
    margin-right: 10px;
    cursor: pointer;
    background-color: rgba($secondary-text-rgb, 0.04);
    border-radius: 3px;
    padding: 11px 10px;
    font-size: 16px;

    img {
      height: 100%;
      width: auto;
      margin-right: 5px;
      margin-left: 5px;
    }

    .iconfont {
      display: inline-block;
      font-size: 16px;
      margin-right: 2px;
      transform: rotate(180deg);
    }
  }

  .header__btn {
    width: 24px;
    height: 22px;
    margin-right: 10px;
    position: relative;
    top: 1px;

    span {
      position: absolute;
      left: 0;
      display: block;
      width: 24px;
      height: 2px;
      background-color: #ffffff;
      border-radius: 3px;
      transition: 0.5s ease;
    }

    span:nth-child(1) {
      top: 0;
    }

    span:nth-child(2) {
      top: 10px;
      width: 16px;
    }

    span:nth-child(3) {
      top: 20px;
      width: 8px;
    }
  }

  .header__btn--active {
    span:first-child {
      transform: rotate(45deg);
      top: 10px;
    }

    span:nth-child(2) {
      opacity: 0;
    }

    span:last-child {
      width: 24px;
      transform: rotate(-45deg);
      top: 10px;
    }
  }

  .header__tagline {
    display: none;
  }

  .header__tagline div {
    font-size: 16px;
    font-weight: 800;
  }

  .header__nav {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: transparent;
    top: auto;
    bottom: auto;
    left: auto;
    right: auto;
    width: auto;
    transform: translate3d(0, 0, 0);
    padding: 0;
    margin-right: auto;
    border-top: none;
    z-index: 2;
    height: 80px;
    position: relative;
    top: 2px;
  }

  .header__nav--active {
    transform: translate3d(0, 0, 0);
  }

  .header__nav>li {
    display: block;
    margin-left: 1vw;
    margin-bottom: 0;
    position: relative;
    padding: 10px 10px;

    &.active {
      &:after {
        content: ' ';
        width: 100%;
        height: 70%;
        background-color: rgba($secondary-text-rgb, 0.1);
        position: absolute;
        bottom: 16%;
        left: 0;
      }
    }

    &:hover {
      .header__dropdown {
        display: block;
      }
    }

    .iconfont {
      font-size: 11px;
    }

    .header__dropdown {
      display: none;
      position: absolute;
      top: 45px;
      background-color: rgba($secondary-text-rgb, 0.07);
      border-bottom: none;
      z-index: 10;
      left: -15%;
      padding: 5px;

      li {
        background-color: rgba($primary-bg-rgb, 1);
        border-bottom: 1px solid rgba($secondary-text-rgb, 0.1);
        width: 330px;
        padding: 15px 15px;

        a {
          text-align: left;
        }

        .icon {
          height: 35px;
          width: 35px;
          margin-right: 10px;
        }

        .title {
          font-size: 16px;
          margin-bottom: 2px;
        }

        .subtitle {
          font-size: 12px;
          color: rgba($secondary-text-rgb, 0.5);
        }
      }
    }
  }

  .header__nav a {
    display: inline-block;
    font-size: 16px;
    line-height: 16px;
    font-weight: bold;
    text-align: center;
    // color: #b7b7b7 !important;
    background: transparent !important;
    width: 100%;
    cursor: pointer;
    display: block;
    padding: 6px 0;
  }

  .header__nav a:hover,
  .header__nav a[aria-expanded="true"] {
    color: $primary-text;
  }

  .header__nav a:hover svg,
  .header__nav a[aria-expanded="true"] svg {
    fill: $primary-text;
  }

  .coin__btn {
    width: 45px;
    margin-right: 3px;
    padding: 10px;

    svg {
      width: 100%;
      height: auto;
      fill: rgba($secondary-text-rgb, 1);
    }
  }

  .header__cta {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 30px;
    background-color: transparent;
    overflow: hidden;
    margin-right: 0px;
    padding: 0 9px 0 3px;
    border: 1Px solid rgba($primary-text-rgb, 0.2);
    cursor: pointer;
    filter: grayscale(100%);
    // filter: grayscale(50%);

    &.inverse {
      background-color: rgba($primary-text-rgb, 1);

      span {
        color: #040406;
        letter-spacing: -1px;
      }
    }

    .uicon {
      width: 36px;
      height: 36px;
      cursor: pointer;
      margin-left: -3px;
      margin-right: -2px;
    }

    svg {
      width: 23px;
      height: auto;
      fill: $primary-text;
    }

    span {
      display: block;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      font-size: 16px;
      font-weight: bold;
      line-height: 16px;
      color: $primary-text;
      transition: 0.5s ease;
      word-break: break-all;
    }
  }

  @media (max-width: 765px) {
    .header__nav {
      background-color: #090909;
      position: fixed;
      top: 80px;
      left: 0;
      height: 100vh;
      padding: 25px 45px;
      display: none;
      width: 100vw;

      li {
        width: 250px;
        margin: 0 auto;

        &:first-child {
          display: block;
        }

        &.active {
          &:after {
            width: 120%;
            left: -10%;
            height: 100%;
            bottom: 0;
          }
        }

        a {
          padding: 10px;
        }

        .header__dropdown {
          background-color: transparent;
          display: block;
          position: relative;
          top: 0;
          left: 0;

          li {
            width: 100%;

            a {
              text-align: center;
            }
          }
        }
      }
    }

    .connect {
      display: none;
    }

    .header__dropdown {
      li {
        padding: 0 !important;
      }

      .icon {
        display: none;
      }

      .title-wrap {
        width: 100%;
      }

      .title {
        width: 100%;
        text-align: center;
      }

      .subtitle {
        display: none;
      }
    }

    .header__nav--active {
      display: block;
    }
  }
}
</style>