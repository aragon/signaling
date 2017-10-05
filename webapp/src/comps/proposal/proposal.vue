<template>
  <section class="proposal">
    <header class="header">
      <h1 class="title">{{ proposal.title }}</h1>
      <time
        class="closes"
        :title="closesDateHuman"
        :datetime="closesDate"
      >
        {{ closesRelative }}
      </time>
    </header>
    <ul class="options">
      <li v-for="option in options" class="option">
        <div class="label">{{option.label}}</div>
        <div class="progress">
          <div
            class="progress-bar"
            :style="`transform: scaleX(${option.support})`"
          />
        </div>
        <div class="total">
          {{option.total}}
          {{proposal.symbol}}
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
  import { format, distanceInWordsToNow } from 'date-fns'
  export default {
    props: ['proposal'],
    computed: {
      options() {
        return this.proposal.options.sort((a, b) => b.support - a.support)
      },
      closesDate() {
        return format(new Date(this.proposal.closes))
      },
      closesDateHuman() {
        return format(new Date(this.proposal.closes))
      },
      closesRelative() {
        const distance = distanceInWordsToNow(new Date(this.proposal.closes))
        if (this.proposal.closes > Date.now()) {
          return `Ends in ${distance}`
        }
        return `Ended ${distance} ago`
      }
    }
  }
</script>

<style scoped>
  @import '../../../toolkit/shared-styles.css';
  .proposal {
    border: 1px solid #e8e8e8;
    padding: 40px;
    transition: all 0.2s ease-in-out;
    border-radius: 3px;
    background: white;
    cursor: pointer;
  }
  .proposal:hover {
    transform: translateY(-5px);
    box-shadow: 0px 1px 5px rgba(var(--grey500-rgb), 0.1);
  }
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
  }
  .title {
    font-size: 24px;
    color: var(--grey700);
  }
  .closes {
    margin-left: 20px;
    font-size: 12px;
    white-space: nowrap;
    color: var(--grey600);
  }
  .option {
    display: flex;
    flex-wrap: nowrap;
    margin: 20px 0;
  }
  .label {
    display: flex;
    align-items: center;
    width: 20%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 20px;
  }
  .progress {
    overflow: hidden;
    width: 100%;
    height: 100%;
    border-radius: 2px;
    background: #00cae422;
  }
  .progress-bar {
    height: 25px;
    background-image: linear-gradient(130deg, var(--aragon), var(--aragonAlt));
    transform-origin: 0 50%;
  }
  .total {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 5em;
    margin-left: 20px;
    white-space: nowrap;
  }
</style>
