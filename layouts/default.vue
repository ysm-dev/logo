<template>
  <nuxt />
</template>

<style lang="scss">
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
html,
body {
  height: 100%;
}
#__nuxt,
#__layout {
  height: 100%;
}

#__layout {
  display: grid;
}

::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

@keyframes scale-out {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0);
  }
}

$ease: cubic-bezier(0, 0, 0.2, 1);
$overshoot: cubic-bezier(0.175, 0.885, 0.32, 1.275);
$easeout: cubic-bezier(0.215, 0.61, 0.355, 1);

.fade-enter-active {
  animation: fadeIn 0.2s $ease;
}

.fade-leave-active {
  animation: fadeOut 0.1s $ease;
}

.scale-enter-active {
  animation: scale-in 0.2s $overshoot;
}

.scale-leave-active {
  animation: scale-out 0.1s $easeout;
}
</style>
