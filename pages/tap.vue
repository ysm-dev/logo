<template>
  <section class="container">
    <div class="header">
      <img class="logo"
           src="https://storage.googleapis.com/io-19-assets/images/global/hashtag.gif" />
      <img class="people__icon"
           src="https://images.velog.io/post-images/chris/65105e50-6f27-11e9-bd0f-b56b5afb4279/people.svg" />
      <div class="people__count">{{ users.length }}</div>
    </div>
    <div class="middle">
      <div class="description">
        <span class="name">{{ user && user.name}}</span>님<br />
        <span class="caption">활성화되는 버튼을 눌러주세요.</span>
      </div>
      <div class="score">
        <div class="score__title">
          Score
        </div>
        <div class="score__value">
          {{ user && user.score }}
        </div>
      </div>
    </div>
    <div class="buttons">
      <a-button v-for="i in 12"
                :key="i"
                class="tap"
                type="primary"
                :disabled="(!status.isStart || (user && user.isTapped)) || i !== activeButton"
                @click="tap">{{ (!status.isStart || (user && user.isTapped)) || i !== activeButton ? `Ready` : 'Tap'}}</a-button>
    </div>
    <div class="modal">
      <transition name="fade">
        <div class="modal__mask"
             v-show="showRank"></div>
      </transition>
      <transition name="scale">
        <div class="modal__wrap"
             v-show="showRank">
          <div class="modal__content">
            <img class="close"
                 @click="showRank = false"
                 src="https://images.velog.io/post-images/chris/0187f4d0-6f43-11e9-b897-993fc83afca8/x.svg" />
            <div class="title">Rank</div>
            <img class="particle"
                 src="https://images.velog.io/post-images/chris/e1d87770-6f44-11e9-b897-993fc83afca8/particle.svg" />
            <div class="ranking">{{ ranking }}</div>
            <img class="top1"
                 v-if="ranking === 1"
                 src="https://images.velog.io/post-images/chris/fb010c80-6f44-11e9-b897-993fc83afca8/medal.svg" />
            <div class="time">{{ time / 1000 }} 초</div>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>

<script>
import firebase from 'firebase/app'
import db from '../plugins/db.js'
import { pageMixin } from '@/plugins/mixin.js'

export default {
  mixins: [pageMixin],
  data() {
    return {
      key: null,
      user: null,
      showRank: false,
      ranking: 0,
      time: 0,
    }
  },
  firebase: {
    users: {
      source: db.ref('/users'),
      asArray: true,
      readyCallback() {
        const me = this.users.filter(user => user['.key'] === this.$route.query.key)
        if (me.length === 0) {
          this.$router.push('/signin')
        }
      },
    },
    status: {
      source: db.ref('/status'),
      asObject: true,
    },
  },
  mounted() {
    this.$bindAsObject('user', db.ref(`/users/${this.$route.query.key}`))
    this.$bindAsObject('problem', db.ref(`/problem`))
    this.key = this.$route.query.key
    window.onbeforeunload = () => {
      db.ref(`/users/${this.key}`).set({})
    }
  },
  beforeDestroy() {
    db.ref(`/users/${this.key}`).set({})
  },
  methods: {
    tap() {
      if (!this.user.isTapped) {
        db.ref(`/users/${this.$route.query.key}/isTapped`).set(true)
        const tapTime = firebase.database.ServerValue.TIMESTAMP
        db.ref(`/problem/${this.status.problemNumber}/rank`)
          .push({
            name: this.user.name,
            tapTime,
          })
          .then(e => {
            const rank = this.problem['.value'][this.status.problemNumber].rank
            const startTime = this.problem['.value'][this.status.problemNumber].startTime
            const tapTime = this.problem['.value'][this.status.problemNumber].rank[e.key].tapTime
            this.time = tapTime - startTime
            this.ranking =
              Object.keys(rank)
                .sort((a, b) => rank[a].tapTime - rank[b].tapTime)
                .findIndex(k => k === e.key) + 1
            this.showRank = true
          })
      }
    },
  },
  computed: {
    activeButton() {
      return this.status.isStart ? Math.floor(Math.random() * 12) + 1 : -1
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  max-width: 480px;
  justify-self: center;
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: 68px 100px 1fr;
  overflow: hidden;
  .header {
    height: 68px;
    width: 100%;
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: auto 1fr auto;
    .logo {
      width: 65px;
      margin-left: 18px;
      align-self: center;
    }
    .name {
      font-family: 'Noto Sans KR', sans-serif;
      justify-self: center;
      align-self: center;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.38);
      line-height: 140%;
      letter-spacing: -0.05em;
    }
    .people__icon {
      align-self: center;
      justify-self: end;
      height: 14px;
    }
    .people__count {
      font-family: 'Roboto Mono';
      font-size: 14px;
      text-align: right;
      letter-spacing: -0.05em;
      color: rgba(0, 0, 0, 0.5);
      align-self: center;
      margin-right: 25px;
      width: 26px;
    }
  }
  .middle {
    position: relative;
    height: 100px;
    .description {
      position: absolute;
      left: 20px;
      font-family: 'Noto Sans KR', sans-serif;
      font-size: 22px;
      line-height: 30px;
      letter-spacing: -0.04em;
      color: #5f5f5f;
      font-weight: 500;
      text-align: left;
      .name {
        font-weight: 800;
        color: #4587f0;
      }
      .caption {
        font-size: 14px;
      }
    }
    .score {
      position: absolute;
      right: 25px;
      &__title {
        font-weight: 800;
        font-size: 14px;
        line-height: 19px;
        letter-spacing: -0.04em;
        color: #5f5f5f;
      }
      &__value {
        font-weight: 800;
        font-size: 24px;
        line-height: 33px;
        text-align: center;
        letter-spacing: -0.04em;
        color: #4587f0;
      }
    }
  }
  .buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    grid-gap: 20px;
    padding: 20px;
    .tap {
      justify-self: center;
      border-radius: 500px;
      height: 80px;
      width: 80px;
    }
  }
  .rank {
    justify-self: center;
    align-self: start;
    font-family: 'Noto Sans KR', sans-serif;
    height: 48px;
    width: 190px;
    font-size: 28px;
    font-weight: bold;
    font-size: 16px;
    line-height: 22px;
    color: #ffffff;
    box-shadow: 2px 3px 4px #dfdfdf;
    border-radius: 6px;
  }
  .modal {
    position: absolute;
    &__mask {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.65);
      height: 100%;
      z-index: 1000;
    }
    &__wrap {
      position: fixed;
      display: grid;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      height: 100%;
      z-index: 1000;
    }
    &__content {
      position: relative;
      display: grid;
      justify-self: center;
      align-self: center;
      width: 319px;
      height: 366px;
      background-color: white;
      border-radius: 26px;
      .close {
        position: absolute;
        right: 0;
        padding: 23px;
      }
      .title {
        position: absolute;
        font-style: normal;
        font-weight: 800;
        font-size: 22px;
        line-height: 30px;
        text-align: center;
        letter-spacing: -0.04em;
        justify-self: center;
        top: 33px;
        color: #5f5f5f;
      }
      .particle {
        position: absolute;
        justify-self: center;
        top: 100px;
      }
      .ranking {
        position: absolute;
        font-family: Roboto;
        font-weight: 900;
        font-size: 70px;
        line-height: 82px;
        text-align: center;
        letter-spacing: -0.04em;
        justify-self: center;
        align-self: center;
        color: #2b2b2b;
      }
      .time {
        position: absolute;
        font-weight: 800;
        font-size: 22px;
        line-height: 30px;
        text-align: center;
        letter-spacing: -0.04em;
        justify-self: center;
        bottom: 20px;
        color: #5f5f5f;
      }
      .top1 {
        position: absolute;
        top: 215px;
        justify-self: center;
      }
    }
  }
}
</style>
