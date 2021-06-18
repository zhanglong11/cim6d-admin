<template>
  <div>
    <el-image :style="{ width: width + 'px', height: height + 'px' }" :src="imageUrl" :preview-src-list="[imageUrl]">
    </el-image>
  </div>
</template>

<script>
import api from '@/api/company'
export default {
  name: 'ImagePreview',
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    width: {
      type: [String, Number],
      default: 40
    },
    height: {
      type: [String, Number],
      default: 40
    }
  },
  data() {
    return {
      imageUrl: ''
    }
  },
  watch: {
    id: {
      immediate: true,
      handler() {
        if (typeof this.id !== 'string') {
          return
        }
        api.getFileList([this.id]).then(res => {
          this.imageUrl = res.data[0].fileUrl
        })
      }
    }
  },
  methods: {}
}
</script>

<style scoped lang="less">
.accept {
  color: #999;
}
</style>
