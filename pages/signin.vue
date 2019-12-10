<template>
  <section class="container">
    <div class="mobile">
      <img src="https://storage.googleapis.com/io-19-assets/images/global/hashtag.gif" />
      <a-form>
        <a-form-item :validate-status="status"
                     has-feedback
                     :help="message">
          <a-input :value="name"
                   @change="input"
                   @pressEnter="pressEnter"
                   size="large"
                   placeholder="이름을 입력해주세요!" />
        </a-form-item>
        <a-button type="primary"
                  @click="goClick"
                  :disabled="!isValid">Get Started!</a-button>
      </a-form>
    </div>
  </section>
</template>

<script>
import db from '../plugins/db.js'
import { pageMixin } from '@/plugins/mixin.js'

const newId = () =>
  String(Math.random())
    .substring(2)
    .split('')
    .reverse()
    .join('')

export default {
  mixins: [pageMixin],
  data() {
    return {
      name: '',
      status: '',
      message: '',
      users: [],
    }
  },
  firebase: {
    users: {
      source: db.ref('/users'),
      asArray: true,
    },
  },
  methods: {
    input(e) {
      this.name = e.target.value
      console.log(this.users)
      if (this.users.filter(user => user.name === this.name).length !== 0) {
        this.message = '중복된 이름이 있습니다!'
        this.status = 'error'
      } else if (this.name.length > 10) {
        this.message = '10자 이하로 만들어주세요!'
        this.name = this.name.slice(0, 10)
        this.status = 'error'
      } else {
        this.message = ''
        this.status = ''
      }
    },
    pressEnter() {
      if (!this.isValid) return
      this.goClick()
    },
    goClick() {
      const user = {
        name: this.name,
        isTapped: false,
        score: 0,
      }
      const key = db.ref(`/users`).push(user).key
      this.$router.push(`/tap?key=${key}`)
    },
  },
  computed: {
    isValid() {
      return (
        this.name !== '' &&
        this.users &&
        this.users.filter(user => user.name === this.name).length === 0 &&
        this.name.length <= 10
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: grid;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  .mobile {
    max-width: 480px;
    img {
      width: 70%;
    }
    form {
      width: 100%;
      input {
        width: 60%;
        text-align: center;
        margin-bottom: 12px;
      }
      button {
        font-family: 'Noto Sans KR', sans-serif;
        box-shadow: 2px 3px 4px #dfdfdf;
        height: 48px;
        width: 147px;
        margin-bottom: 30px;
      }
    }
  }
}
</style>
