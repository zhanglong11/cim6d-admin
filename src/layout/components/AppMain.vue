<template>
  <section class="app-main">
    <el-main>
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key" />
      </transition>
    </el-main>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  background: #f0f2f5;
  flex-direction: column;
  height: 100vh;
}

.el-main {
  padding: 15px;
  display: flex;
  flex-direction: column;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>
<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
