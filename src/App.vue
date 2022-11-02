<template>
  <router-view></router-view>
</template>

<script>

export default {
  name: 'App',
  components: {}
}
</script>

<style>
html {
  width: 100%;
  height: 100%;
}

/*去除手机端点击蓝色边框*/
html * {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}

body {
  width: 100%;
  height: 100%;
  background-color: #f3f3f3;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
