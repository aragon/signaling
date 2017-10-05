<template>
  <div class="proposal">
    <h3>{{ proposal.title }}</h3>
    <div class="endDate">{{ proposal.endDate }}Ends on 15 Nov 2017</div>
    <ul>
      <li v-for="option in proposal.options">
        <div>{{option.label}}</div>
        <progress
          :value="Math.round(option.support * 100)"
          max="100"
        />
        <span>
          {{option.total}}
          {{proposal.symbol}}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: ['proposal']
  }
</script>

<style scoped>
  @import '../../../toolkit/shared-styles.css';
  .proposal {
    background-color: white !important;
    border: 1px solid #e8e8e8;
    padding: 10px 20px;
    margin-bottom: 20px;
    transition: all 0.5s ease-in-out;
    cursor: pointer;
  }
  .proposal:hover {
    transform: translateY(-5px);
    box-shadow: 0px 1px 5px rgba(var(--grey500-rgb), 0.1);
  }
  .proposal h3 {
    font-size: 18px;
    margin-top: 0;
    margin-bottom: 14px;
    font-weight: normal;
    max-width: 66%;
    display: inline-block;
  }
  .proposal .endDate {
    font-size: 12px;
    float: right;
    text-align: center;
    margin-top: 5px;
    color: var(--grey600);
  }
  .proposal ul {
    list-style: none;
  }
  .proposal ul li div {
    display: inline-block;
    width: 40%;
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
