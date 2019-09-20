<template>
  <section class="container">
    <div class="card"
         v-for="item in problems"
         :key="item.answer">
      <img :src="item.image" />
      <div class="name"
           :style="{
              backgroundColor: backgroundColor(item.level)
            }">
        {{ item.answer }}
      </div>
    </div>
  </section>
</template>

<script>
import db from '../plugins/db.js'
import { problems } from '@/assets/problems.js'

export default {
  data() {
    return {
      problems,
    }
  },
  methods: {
    backgroundColor(lev) {
      if (lev === 1) {
        return 'rgba(114,181,102,.8)'
      } else if (lev === 2) {
        return 'rgba(231,175,95,.8)'
      } else if (lev === 3) {
        return 'rgba(203,92,84,.8)'
      }
      return ''
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  padding: 10px;
  .card {
    display: grid;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    img {
      /* border-bottom: 1px solid rgba(0, 0, 0, 0.5); */
      justify-self: center;
      min-width: 80px;
      max-width: 100px;
      min-height: 80px;
      max-height: 100px;
      margin: 10px;
    }
    .name {
      font-family: 'Noto Sans KR';
      color: white;
      border-top: 1px solid rgba(0, 0, 0, 0.5);
      width: 100%;
      text-align: center;
      justify-self: center;
    }
  }
}
</style>
