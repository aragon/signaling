<template>
  <Motion tag="div" v-bind:values="motionData" v-bind:spring="openSpring">
    <template scope="props">
      <section
        class="proposal"
        :class="{'proposal-opened': opened}"
        :style="getProposalStyle(props.openProgress)"
      >
        <div
          class="proposal-in"
          :style="getProposalInStyle(props.openProgress)"
        >
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
          <div class="content">
            <div class="first-part">
            </div>
            <div class="second-part" :style="getSecondPartStyle(props.openProgress)">
              <div>
                <ul class="options" v-show="options.length">
                  <li v-for="option in options" class="option">
                    <div class="label">
                      <span>{{option.label}}</span>
                    </div>
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
              </div>
              <div
                class="second-part-line"
                :style="getSecondPartLineStyle(props.openProgress)"
              >
                
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
  </Motion>
</template>

<script>
  import { format, distanceInWordsToNow } from 'date-fns'
  import { lerp } from '../../utils'
  export default {
    props: ['proposal', 'opened'],
    data() {
      return {
        rect: null,
        openSpring: {
          stiffness: 310,
          damping: 30
        }
      }
    },
    methods: {
      getProposalStyle(progress) {
        if (!this.rect) {
          return {}
        }
        return {
          width: this.rect.width + 'px',
          height: this.rect.height + 100 * progress + 'px'
        }
      },
      getProposalInStyle(progress) {
        if (!this.rect) {
          return {}
        }
        const distance = lerp(1, -120, progress)
        return {
          position: 'absolute',
          top: distance + 'px',
          left: distance + 'px',
          right: distance + 'px',
          bottom: distance + 'px',
          boxShadow: `0 3px 20px rgba(113, 113, 113, ${progress * 0.3})`
        }
      },
      getSecondPartStyle(progress) {
        return {
          marginTop: 20 * progress + 'px',
          width: lerp(100, 40, progress) + '%',
        }
      },
      getSecondPartLineStyle(progress) {
        return {
          opacity: progress,
          height: progress * 90 + '%',
          top: lerp(50, 5, progress) + '%'
        }
      }
    },
    watch: {
      opened(opened, oldOpened) {
        if (opened && !this.rect) {
          this.rect = this.$el.getBoundingClientRect()
        }
      }
    },
    computed: {
      motionData() {
        return {
          openProgress: Number(this.opened)
        }
      },
      options() {
        if (!this.proposal || !this.proposal.options) {
          return []
        }
        return this.proposal.options.sort((a, b) => b.support - a.support)
      },
      closesDate() {
        return format(new Date(this.proposal.closes))
      },
      closesDateHuman() {
        return format(new Date(this.proposal.closes))
      },
      closesRelative() {
        const { closes } = this.proposal
        if (!closes) {
          return ''
        }
        const distance = distanceInWordsToNow(new Date(closes))
        if (closes > Date.now()) {
          return `Ends in ${distance}`
        }
        return `Ended ${distance} ago`
      }
    }
  }
</script>

<style scoped>
  @import '../../shared-styles.css';
  .proposal {
    position: relative;
  }
  .proposal-in {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    border: 1px solid #e8e8e8;
    padding: 40px;
    border-radius: 3px;
    background: white;
    cursor: pointer;
    -webkit-touch-callout: none;
    user-select: none;
  }
  .proposal-opened {
    position: relative;
    z-index: 2;
  }
  .proposal:active {
    transform: translateY(0);
    box-shadow: none;
  }
  .header {
    display: flex;
    justify-content: space-between;
  }
  .header + .options {
    margin-top: 30px;
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
  .content {
    display: flex;
    justify-content: flex-end;
    height: 100%;
  }
  .second-part {
    position: relative;
  }
  .second-part-line {
    position: absolute;
    left: -50px;
    border-left: 1px solid var(--grey400);
  }
  .options {
    width: 100%;
  }
  .option {
    display: flex;
    flex-wrap: nowrap;
    margin: 20px 0;
  }
  .label {
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    width: 15%;
    align-items: center;
    margin-right: 20px;
  }
  .label span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
    flex-grow: 0;
    flex-shrink: 0;
    align-items: center;
    justify-content: flex-end;
    min-width: 5em;
    margin-left: 20px;
    white-space: nowrap;
  }
</style>
