<template>
  <div class="proposal">
    {{ proposal.title }}
  </div>
</template>

<script>
  export default {
    props: [
      'proposal'
    ]
  }
</script>

<style scoped>
  @import '../../../toolkit/shared-styles.css';
  .signaling .logo {
    width: 256px;
    display: inline-block;
    vertical-align: middle;
  }
  .signaling h1 {
    margin: 100px 0;
    text-align: right;
    display: inline-block;
  }
</style>