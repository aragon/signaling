<template>
  <div class="header">
    <div class="header-in">
      <div>
        <a href="/" class="logo">
          <img src="./assets/isotype.svg" width="44" v-once />
          <img src="./assets/logotype.svg" width="99" v-once />
        </a>
        <div>
        <h1>Signaling</h1>
      </div>
        <nav class="nav">
          <ul>
            <li v-for="item in menuItems">
              <a
                :href="item[0]"
                :class="{active: item[2]}"
              >
                {{item[1]}}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
  import { aButton } from '../..'
  export default {
    components: {
      'a-button': aButton
    },
    props: {
      menuItems: Array
    }
  }
</script>

<style scoped>
  @import '../../shared-styles.css';
  .header {
    background: var(--white);
    border-bottom: 1px solid #e8e8e8;
    & .button {
      margin-left: 10px;
    }
  }
  .header-in {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    min-height: 70px;
    max-width: 1140px;
    margin: 0 auto;
  }
  .header-in > div {
    display: flex;
    align-items: center;
  }
  .header-in > div:first-child {
    align-items: stretch;
  }
  .header-in h1 {
    font-size: 20px;
    margin-left: 38px;
    margin-top: 18px;
    font-weight: normal;
  }
  .logo {
    display: flex;
    align-items: center;
    padding-right: 40px;
    border-right: 1px solid #e8e8e8;
    padding-top: 6px;
    padding-bottom: 8px;
  }
  .logo img:first-child {
    margin-right: 10px;
  }
  .nav {
    display: flex;
    align-items: stretch;
    & ul {
      display: flex;
      align-items: stretch;
      list-style: none;
      margin-left: 30px;
    }
    & li {
      display: flex;
      align-items: stretch;
    }
    & a {
      display: flex;
      align-items: center;
      padding: 0 30px;
      text-decoration: none;
      font-size: 15px;
      color: var(--grey500);
      &.active {
        color: var(--turquoise500);
      }
    }
  }
</style>
