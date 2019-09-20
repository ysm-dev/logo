<template>
  <section class="container"
           @click="log">
    올바르지 않은 접근입니다!
  </section>
</template>

<script>
import db from '../plugins/db.js'

export default {
  firebase: {
    root: db.ref('/'),
  },
  methods: {
    log() {
      console.log(this.root)
    },
  },
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
