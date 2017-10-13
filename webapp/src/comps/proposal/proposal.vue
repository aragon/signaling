<template>
  <Motion
    tag="div"
    v-bind:values="motionData"
    v-bind:spring="openSpring"
    @motion-end="handleOpenEnd"
  >
    <template scope="props">
      <section
        class="proposal"
        :class="{'proposal-opened': opened}"
        :style="getProposalStyle(props.openProgress)"
        @click="handleProposalClick"
      >
        <div
          ref="proposalIn"
          class="proposal-in"
          :style="getProposalInStyle(props.openProgress)"
        >
          <a
            class="proposal-close"
            role="button"
            :style="getCloseStyle(props.openProgress)"
            @click="handleClose"
          >
            close
          </a>
          <header
            class="header"
            :style="getHeaderStyle(props.openProgress)"
          >
            <h1 class="title">{{proposal.title}}</h1>
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
              <div
                class="first-part-content"
                v-show='content && props.openProgress === 1'
                v-html='content'
              />
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
              />
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
    props: {
      proposal: Object,
      content: String,
      opened: Boolean,
    },
    data() {
      return {
        rect: null,
        openSpring: {
          stiffness: 310,
          damping: 30,
          precision: 0.01
        }
      }
    },
    methods: {
      handleProposalClick() {
        if (!this.opened) {
          this.$emit('requestOpen')
        }
      },
      handleClose(e) {
        e.stopPropagation()
        this.$emit('requestClose')
      },
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
        const hdistance = lerp(1, -120, progress)
        return {
          position: 'absolute',
          top: - lerp(0, window.innerHeight - this.rect.height, progress) / 2 + 'px',
          height: lerp(this.rect.height, window.innerHeight - 40, progress) + 'px',
          left: hdistance / 2 + 'px',
          right: hdistance / 2 + 'px',
          boxShadow: `0 3px 20px rgba(113, 113, 113, ${progress * 0.3})`
        }
      },
      getCloseStyle(progress) {
        return {
          display: progress > 0? 'block' : 'none',
          opacity: progress,
        }
      },
      getHeaderStyle(progress) {
        return {
          paddingBottom: 20 + 20 * progress  + 'px'
        }
      },
      getSecondPartStyle(progress) {
        return {
          width: lerp(100, 40, progress) + '%',
        }
      },
      getSecondPartLineStyle(progress) {
        return {
          opacity: progress,
          height: progress * 100 + '%',
          top: lerp(50, 0, progress) + '%'
        }
      },
      handleOpened() {
        if (!this.opened) {
          return
        }
        if (!this.rect) {
          this.rect = this.$el.getBoundingClientRect()
        }
          this.$refs.proposalIn.scrollIntoView({ behavior: 'smooth' })
      },
      handleOpenEnd() {
        if (this.opened) {
          this.$refs.proposalIn.scrollIntoView({ behavior: 'smooth' })
        }
      }
    },
    watch: {
      opened() {
        this.handleOpened()
      }
    },
    mounted() {
      this.handleOpened()
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
  .proposal-close {
    position: absolute;
    z-index: 2;
    top: 10px;
    right: 15px;
    text-decoration: underline;
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
    align-items: center;
    padding-bottom: 20px;
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
    height: calc(100% - 60px);
  }
  .first-part-content {
    height: calc(100%);
    margin-right: 70px;
    padding-right: 30px;
    padding-left: 20px;
    overflow-y: scroll;
  }
  .first-part-content >>> p,
  .first-part-content >>> ul {
    margin: 20px 0;
  }
  .first-part-content >>> ul ul {
    margin-left: 20px;
  }
  .first-part-content >>> li {
    line-height: 1.5;
  }
  .first-part-content >>> h2,
  .first-part-content >>> h3,
  .first-part-content >>> h4,
  .first-part-content >>> h5,
  .first-part-content >>> h6 {
    margin: 20px 0;
    font-weight: 600;
  }
  .second-part {
    flex-shrink: 0;
    position: relative;
  }
  .second-part-line {
    position: absolute;
    left: -40px;
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
