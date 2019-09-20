<template>
  <section class="container"
           @click="log">
    안녕하세요
  </section>
</template>

<script>
import db from '../plugins/db.js'

export default {
  mounted() {
    this.$router.push('/signin')
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
