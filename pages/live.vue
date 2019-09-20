<template>
  <div class="container">
    <!-- <div v-for="user in users"
         :key="user.uid"
         class="name"
         :style="getRandomPosition()">
      {{ user.name }}
    </div> -->
    <div class="header">
      <img class="logo"
           src="https://storage.googleapis.com/io-19-assets/images/global/hashtag.gif" />
      <div class="title">
        Google I/O<br />
        Viewing Party 2019
      </div>
      <img class="people__icon"
           src="https://images.velog.io/post-images/chris/65105e50-6f27-11e9-bd0f-b56b5afb4279/people.svg" />
      <div class="people__count">{{ users.length }}</div>
    </div>
    <div class="main">
      <div class="link"
           v-show="!isCounting && !isStarted">
        https://logo.ysm.now.sh
      </div>
      <a-button class="start"
                shape="circle"
                block
                @click="countDown(1)"
                v-show="!isCounting && !isStarted">START</a-button>
      <a-progress type="circle"
                  class="progress"
                  :percent="percent"
                  :format="format"
                  :width="windowWidth"
                  :showInfo="false"
                  :strokeWidth="8"
                  :strokeColor="'#4587F0'"
                  :strokeLinecap="'square'"
                  v-show="isCounting" />

      <img class="icon"
           v-show="!isCounting && isStarted"
           :src="currentProblem.image" />
      <div class="counter"
           v-show="isCounting">{{ format(percent) }}</div>
      <div class="ranking"
           v-show="!isCounting && isStarted">
        <div class="ranking__header">
          <img class="ranking__icon"
               src="https://images.velog.io/post-images/chris/66827130-6fb1-11e9-981d-676f9f658736/crown.svg" />
          <span class="ranking__title">
            Ranking
          </span>
        </div>
        <div class="ranking__table">
          <div class="ranking__data"
               v-for="(row, i) in rankData"
               :key="row.name">
            <div class="ranking__name">
              {{ i+1 }} &nbsp;&nbsp;{{ row.name }}
            </div>
            <div class="ranking__time">
              {{ row.time }}
            </div>
            <a-button class="ranking__score plus"
                      @click="addScore(row)">
              +{{ currentProblem.level }}
            </a-button>
            <a-button class="ranking__score minus"
                      @click="minusScore(row)">
              -{{ currentProblem.level }}
            </a-button>
          </div>
        </div>
      </div>

      <a-button class="show__answer"
                v-show="!isCounting && !isShowAnswer && isStarted"
                @click="showAnswer">Answer</a-button>
      <div class="answer"
           v-show="isShowAnswer">{{ currentProblem.answer }}</div>
      <div class="next"
           v-show="!isCounting && isStarted">
        <a-button class="next__button"
                  v-for="i in 3"
                  :key="i"
                  :disabled="!isProblemExist(i)"
                  @click="countDown(i)">
          {{ i === 1 ? `Easy (${remain(i)})` : i === 2 ? `Medium (${remain(i)})` : `Hard (${remain(i)})` }}
        </a-button>
      </div>
    </div>
    <div v-show="false">{{ }}</div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import db from '../plugins/db.js'
import { problems } from '@/assets/problems.js'

const pw = 'Le84hZMQpNRvJ6RD99T'

export default {
  data() {
    return {
      currentProblem: {
        image: '',
        answer: '',
        leve: 0,
      },
      windowWidth: 0,
      count: 3000,
      isCounting: false,
      isStarted: false,
      isShowAnswer: false,
      problems,
      prevUser: [],
      users: [],
      status: {},
      problem: {},
    }
  },
  firebase: {
    users: {
      source: db.ref('/users'),
      asArray: true,
    },
    status: {
      source: db.ref('/status'),
      asObject: true,
    },
    problem: {
      source: db.ref('/problem'),
      asObject: true,
    },
  },
  mounted() {
    if (this.$route.query.key !== pw) {
      this.$router.push('/error')
    }
    this.windowWidth = window.innerWidth * 0.225
    addEventListener('resize', () => {
      this.windowWidth = window.innerWidth * 0.225
    })
    this.$message.config({
      duration: 3,
      maxCount: 10,
    })
  },
  methods: {
    getRandomPosition() {
      return {
        top: `${Math.floor(Math.random() * 100)}vh`,
        left: `${Math.floor(Math.random() * 100)}vw`,
      }
    },
    countDown(lev) {
      this.isCounting = true
      this.isStarted = true
      this.isShowAnswer = false
      db.ref('/status/isStart').set(false)
      const levProblems = this.problems.filter(p => p.level === lev)
      const currentProblem = (this.currentProblem = levProblems[Math.floor(Math.random() * levProblems.length)])
      this.problems = this.problems.filter(p => p.answer !== this.currentProblem.answer)
      const timer = setInterval(() => {
        if (this.count > 0) this.count -= 10
        else {
          this.count = 3000
          this.isCounting = false
          clearInterval(timer)
        }
      }, 10)
      setTimeout(() => {
        const problemNumber = this.status.problemNumber + 1
        db.ref('/status').set({
          isStart: true,
          problemNumber,
        })
        db.ref(`/problem/${problemNumber}`).set({
          startTime: firebase.database.ServerValue.TIMESTAMP,
          problemName: currentProblem.answer,
        })
        this.users.map(user => {
          db.ref(`/users/${user['.key']}/isTapped`).set(false)
        })
        this.$bindAsArray('rank', db.ref(`/problem/${this.status.problemNumber}/rank`), null, () => {
          console.log(this.rank)
        })
      }, 3010)
    },
    format(p) {
      return Math.floor(this.count / 1000) + 1 < 4 ? Math.floor(this.count / 1000) + 1 : ''
    },
    showAnswer() {
      this.isShowAnswer = true
      db.ref('/status/isStart').set(false)
    },
    isProblemExist(lev) {
      return this.problems.filter(p => p.level === lev).length !== 0
    },
    addScore(user) {
      const correctUser = this.users.filter(u => u.name === user.name)[0]
      db.ref(`/users/${correctUser['.key']}/score`).set(correctUser.score + this.currentProblem.level)
    },
    minusScore(user) {
      const correctUser = this.users.filter(u => u.name === user.name)[0]
      db.ref(`/users/${correctUser['.key']}/score`).set(correctUser.score - this.currentProblem.level)
    },
    remain(i) {
      return this.problems.filter(p => p.level === i).length
    },
  },
  watch: {
    users: {
      deep: true,
      handler(users) {
        if (this.prevUser.length < users.length) {
          for (let i = 0; i < users.length - this.prevUser.length; i++) {
            this.$message.info(`'${[...users].reverse()[i].name}'님이 입장하셨습니다.`)
          }
        }
        this.prevUser = users
      },
    },
    problem: {
      deep: true,
      handler(pro, OldPro) {
        console.log(Date.now())
        // console.log(pro, OldPro)
      },
    },
  },
  computed: {
    percent() {
      return -((this.count % 1000) / 10 - 100)
    },
    rankData() {
      if (!this.problem || !this.problem['.value'] || !this.problem['.value'][this.status.problemNumber] || !this.rank)
        return []
      const startTime = this.problem['.value'][this.status.problemNumber].startTime
      return [...this.rank]
        .sort((a, b) => a.tapTime - b.tapTime)
        .map(r => ({ key: r.name, time: `${(r.tapTime - startTime) / 1000} 초`, ...r }))
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  display: grid;
  .name {
    position: absolute;
    top: 200px;
    left: 200px;
    font-size: 25px;
  }
  .header {
    position: absolute;
    width: 100%;
    display: flex;
    flex-direction: row;
    .logo {
      height: 100px;
      margin: 20px;
      margin-right: 10px;
    }
    .title {
      font-family: 'Roboto Mono', monospace;
      display: grid;
      align-content: center;
      font-size: 24px;
      color: rgba(0, 0, 0, 0.38);
      line-height: 140%;
      letter-spacing: -0.05em;
    }
    .people__icon {
      position: absolute;
      width: 30px;
      top: 42px;
      right: 122px;
    }
    .people__count {
      position: absolute;
      font-family: 'Roboto Mono';
      font-size: 28px;
      line-height: 100%; /* or 14px */
      letter-spacing: -0.05em;
      color: rgba(0, 0, 0, 0.38);
      text-align: center;
      top: 43px;
      right: 60px;
      width: 59px;
    }
  }
  .main {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .link {
      position: absolute;
      font-family: 'Noto Sans KR', sans-serif;
      font-size: 80px;
      align-self: start;
      color: #437fdd;
    }
    .icon {
      width: 22.5%;
    }
    .show__answer {
      position: absolute;
      width: 265px;
      height: 70px;
      bottom: 16%;
      background: linear-gradient(122.05deg, #eef5ff 19%, #e2edff 109.27%);
      border: 2px solid #4587f0;
      box-sizing: border-box;
      border-radius: 6px;
      font-family: 'Noto Sans KR';
      font-weight: bold;
      font-size: 24px;
      line-height: 33px;
      text-align: center;
      color: #4587f0;
      &:hover {
        background: linear-gradient(120.72deg, #4587f0 25.22%, #437fdd 95.4%);
        border: 2px solid #4587f0;
        box-sizing: border-box;
        border-radius: 6px;
        color: white;
      }
    }
    .answer {
      position: absolute;
      bottom: 16%;
      font-family: 'Roboto Mono';
      font-style: normal;
      font-weight: bold;
      font-size: 50px;
      line-height: 94px;
      text-align: center;
      letter-spacing: -0.04em;
      color: #5f5f5f;
    }
    .ranking {
      position: absolute;
      align-self: center;
      left: 45px;
      height: 430px;
      width: 350px;
      display: grid;
      grid-template-rows: 80px 1fr;
      &__header {
        display: grid;
        grid-auto-flow: column;
        width: 100%;
        height: 80px;
      }
      &__icon {
        margin-right: 20px;
        justify-self: end;
        align-self: center;
      }
      &__title {
        align-self: center;
        font-family: 'Noto Sans KR';
        font-weight: 800;
        font-size: 22px;
        line-height: 30px;
        letter-spacing: -0.04em;
        color: #3c434d;
      }
      &__table {
        background-color: #fbfbfb;
        height: 350px;
        width: 100%;
        overflow-y: scroll;
      }
      &__data {
        position: relative;
        display: grid;
        height: 70px;
        padding-left: 35px;
      }
      &__name {
        align-self: end;
        font-family: 'Noto Sans KR';
        font-weight: 800;
        font-size: 15px;
        line-height: 20px;
        letter-spacing: -0.04em;
        color: #5f5f5f;
      }
      &__time {
        align-self: start;
        font-family: 'Noto Sans KR';
        font-size: 14px;
        line-height: 19px;
        letter-spacing: -0.04em;
        color: #b1b1b1;
      }
      &__score {
        position: absolute;
        align-self: center;
        border: 2px solid #4587f0;
        border-radius: 6px;
        font-family: 'Noto Sans KR';
        font-weight: bold;
        font-size: 14px;
        line-height: 137%; /* or 19px */
        text-align: center;
        color: #4587f0;
        &.plus {
          right: 20px;
        }
        &.minus {
          right: 80px;
        }
        &:hover {
          background: #4587f0;
          color: #ffffff;
        }
      }
    }
    .start {
      font-family: 'Noto Sans KR', sans-serif;
      font-style: normal;
      font-weight: 900;
      line-height: 144%; /* or 115px */
      text-align: center;
      letter-spacing: 0.02em;
      font-size: 5vw;
      width: 22.5%;
      height: 22.5vw;
      border: none;
      background-color: #d1e2fa;
      color: white;
      transition: all 0.1s;
      &:hover {
        background-color: #4587f0;
        box-shadow: 0px 0px 42px #c7dcff;
      }
    }
    .progress {
    }
    .counter {
      position: absolute;
      font-family: 'Roboto Mono';
      font-weight: 900;
      font-size: 8vw;
      text-align: center;
      letter-spacing: 0.02em;
      color: #f8b92b;
    }
    .next {
      position: absolute;
      right: 46px;
      display: grid;
      grid-gap: 16px;
      grid-auto-flow: row;
      &__button {
        background: #ffebbd;
        border-radius: 6px;
        width: 294px;
        height: 56px;
        border: none;
        font-family: 'Noto Sans KR';
        font-weight: bold;
        font-size: 24px;
        line-height: 33px; /* identical to box height */
        text-align: center;
        color: rgba(255, 177, 0, 0.93);
        &:hover {
          color: white;
          background: #f8b92b;
          border: 3px solid rgba(243, 171, 7, 0.93);
          box-sizing: border-box;
        }
        &[disabled='disabled'] {
          background-color: rgba(252, 235, 194, 0.3);
          color: rgba(255, 177, 0, 0.3);
          &:hover {
            border: none;
            color: rgba(255, 177, 0, 0.3);
            background-color: rgba(252, 235, 194, 0.3);
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.ant-message {
  left: unset;
  right: 200px;
  &-notice {
    text-align: right;
  }
}
</style>
