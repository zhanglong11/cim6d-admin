<template>
  <WorkFlow :urlSuffix="$urlSuffix" :token="token" isAdminFlag :flag="config.flag" />
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  name: 'OAList',
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      config: {
        flag: 2
      }
    }
  },
  //监听属性 类似于data概念
  computed: {
    token() {
      return this.$store.state.user.token
    }
  },
  //监控data中的数据变化
  watch: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    console.log(111, this.$store)
  },
  //方法集合
  methods: {} //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
</style>
