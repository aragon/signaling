<template>
  <div class="proposal">
    <h3>{{ proposal.title }}</h3>
    <ul>
      <li v-for="option in options" :key="option.id">
        <div>{{option.text}}</div>
        <progress :value="option.support" max="100"></progress><span>{{option.support}} ANT</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: [
      'proposal'
    ],
    data() {
      return {
        options: [{
          id: 0,
          text: 'Option 1',
          support: 30,
        },
        {
          id: 1,
          text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
          support: 70,
        }]
      }
    },
  }
</script>

<style scoped>
  @import '../../../toolkit/shared-styles.css';
  .proposal {
    background-color: white!important;
    border: 1px solid #e8e8e8;
    padding: 10px 20px;
    margin-bottom: 20px;
  }
  .proposal h3 {
    font-size: 18px;
    margin-top: 0;
    margin-bottom: 14px;
    font-weight: normal;
  }
  .proposal ul {
    list-style: none;
  }
  .proposal ul li div {
    display: inline-block;
    width: 33%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
  }
  .proposal ul li progress[value] {
    -webkit-appearance: none;
    appearance: none;
    margin-left: 10px;
  }
  .proposal ul li progress[value]::-webkit-progress-bar {
    background-color: transparent;
  }
  .proposal ul li progress[value]::-webkit-progress-value {
    background-color: var(--aragon);
    border-radius: 2px; 
  }
  .proposal ul li span {
    color: var(--grey600);
    margin-bottom: 10px;
    font-size: 12px;
  }
</style>