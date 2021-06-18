<template>
  <div>
    <el-upload
      ref="upload"
      class="upload"
      :data="data"
      :drag="!isOnlyButton"
      :action="action"
      :headers="headers"
      name="file"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :show-file-list="!isOnlyButton"
      :auto-upload="autoUpload"
      :on-error="handleError"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :multiple="multiple"
      :accept="accept"
      :list-type="listType"
    >
      <template v-if="!isOnlyButton">
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </template>
      <template v-if="isOnlyButton">
        <div style="text-align: left">
          <el-button slot="trigger" size="small" :type="btnType">{{ btnText }}</el-button>
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
// import api from '@/api/file'
export default {
  name: 'US',
  props: {
    // 已上传文件ids
    ids: {
      type: String,
      default: ''
    },
    // 额外参数
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 上传地址
    action: {
      type: String,
      default: `/cim6d-file${process.env.VUE_APP_BASE_API}/file/commonFile/uploadTwo`
    },
    // 多选
    multiple: {
      type: Boolean,
      default: false
    },
    type: {
      //  文件模块类型
      type: Number,
      default: 0
    },
    // 验证
    raw: {
      type: Boolean,
      default: false
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      default: ''
    },
    isOnlyButton: {
      type: Boolean,
      default: false
    },
    // 接受上传的文件类型（thumbnail-mode 模式下此参数无效）
    accept: {
      type: String,
      default: ''
    },
    btnText: {
      type: String,
      default: '选取文件'
    },
    // 最大允许上传个数
    limit: {
      type: Number,
      default: 1
    },
    // button样式
    btnType: {
      type: String,
      default: 'primary'
    },
    listType: {
      type: String,
      default: 'text'
    }
  },
  data() {
    return {
      fileList: [],
      headers: {
        'x-access-token': getToken()
      }
    }
  },
  watch: {
    fileList: {
      handler: function (n, o) {
        // console.log(n)
      }
    },
    ids: {
      handler: function (n, e) {
        if (typeof n === 'string') {
          this.getFileList()
        }
      },
      immediate: true
    }
  },
  methods: {
    // bug1310 文件查询接口不允许出现空数组 申豪强 2020-03-25
    async getFileList() {
      const arr = this.ids ? this.ids.split(',') : []
      if (arr.length === 0) {
        this.fileList = []
        return
      }
      // const res = await api.getFileList(arr)
      // this.fileList = res.data.map(item => {
      //   const obj = {
      //     name: item.fileName,
      //     id: item.id
      //   }
      //   return obj
      // })
    },
    handleRemove(file, fileList) {
      if (file.status === 'success') {
        this.fileList = this.fileList.filter(item => item.id !== file.id)
        this.$emit('input', this.fileList)
      }
    },
    beforeUpload(file) {
      if (this.raw) {
        if (this.accept) {
          if (!_.some(this.accept.split(','), string => file.name.includes(string))) {
            this.$message.error('文件格式错误，只允许' + this.accept)
            this.fileList.splice(-1, 1)
            return false
          } else {
            this.$emit('input', file)
          }
        } else {
          this.$emit('input', file)
        }
        return false
      }
    },
    handleError(error) {
      this.$message.error(error.status + '：' + error.message)
    },
    handleSuccess(res, file, fileList) {
      if (res.code === 200) {
        const fileItem = {
          id: res.data.id,
          url: res.data.fileUrl
        }
        if (this.multiple) {
          this.fileList = fileList.map(item => {
            const obj = {
              id: item.response.id,
              url: item.response.fileUrl
            }
            return obj
          })
        } else {
          this.$set(file, 'id', res.data)
          this.fileList = [fileItem]
        }
        // console.log('handleSuccess', this.fileList)
        this.$emit('input', this.fileList)
      }
    },
    submit() {
      this.$refs.upload.submit()
    }
  }
}
</script>

<style scoped lang="less"></style>
