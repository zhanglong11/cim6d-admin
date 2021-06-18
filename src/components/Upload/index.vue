<template>
  <div>
    <el-upload
      ref="upload"
      class="upload"
      :data="data"
      :drag="!isOnlyButton"
      :action="action"
      :headers="headers"
      :value="value"
      name="file"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :show-file-list="showFileList"
      :auto-upload="autoUpload && !raw"
      :on-error="handleError"
      :on-remove="handleRemove"
      :list-type="listType"
      :multiple="multiple"
      :accept="accept"
      :limit="limit"
      :on-success="handleSuccess"
      :on-change="changeUpload"
    >
      <template v-if="!isOnlyButton">
        <i class="el-icon-upload" :style="{ marginTop: accept ? '20px' : '40px' }" />
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </template>
      <template v-if="isOnlyButton">
        <div style="text-align: left">
          <slot name="btn">
            <el-button slot="trigger" size="small" type="primary" style="font-size: 16px" icon="el-icon-upload2">{{
              btnText
            }}</el-button>
          </slot>
          <slot></slot>
        </div>
      </template>
    </el-upload>
    <p v-if="accept" class="accept">
      支持扩展名: <span>{{ accept }}</span>
    </p>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import api from '@/api/company'
export default {
  name: 'UploadFile',
  props: {
    // 额外参数
    data: {
      type: Object
    },
    // 上传地址
    action: {
      type: String,
      default: `/cim6d-file${process.env.VUE_APP_BASE_API}/file/commonFile/uploadTwo`
    },
    showFileList: {
      type: Boolean,
      default: true
    },
    value: [Object, Array, File, String],
    // 多选
    multiple: {
      type: Boolean,
      default: false
    },
    raw: {
      type: Boolean,
      default: false
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    name: {
      type: String
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
      default: '上传文件'
    },
    // 最大允许上传个数
    limit: {
      type: Number,
      default: 9
    },
    //	文件列表的类型 text/picture/picture-card
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
      deep: true,
      handler(val) {
        if (this.raw) {
          let raw = this.fileList.length > 0 ? this.fileList[0].raw : ''
          this.$emit('input', this.multiple ? this.fileList.map(e => e.raw) : raw)
        } else {
          const val = this.fileList
            .filter(e => e?.response?.data || e.id)
            .map(e => e.id || e.response.data)
            .join(',')
          const url = this.fileList
            .filter(e => e?.response?.data || e.fileUrl)
            .map(e => e.fileUrl || e.response.data.fileUrl)
            .join(',')
          this.$emit('input', val)
          this.$emit('update:fileUrl', url)
          this.$emit('update:filename', _.map(this.fileList, 'name').join(','))
          this.$emit('update:filename', _.map(this.fileList, 'name').join(','))
          this.$emit('update:fileType', _.map(this.fileList, file => _.last(file.name.split('.'))).join(','))
        }
      }
    },
    value: {
      immediate: true,
      handler() {
        if (typeof this.value !== 'string') {
          return
        }
        let newFileIds = _.difference(
          this.value.split(','),
          this.fileList.map(e => e.id)
        )
        if (newFileIds.length) {
          api.getFileList(newFileIds).then(res => {
            res.data.forEach(e => {
              e.name = e.fileName
              e.url = e.fileUrl
            })
            this.fileList = _.unionBy(res.data.concat(this.fileList), 'id')
          })
        }
      }
    }
  },
  methods: {
    // 选择文件
    changeUpload(file) {
      if (this.raw) {
        // 返回文件流
        this.$emit('input', file.raw)
      }
    },
    handleSuccess(res, file, fileList) {
      if (!this.raw) {
        file.id = file.response.data.id
      }
      if (this.multiple) {
        this.fileList = fileList
      } else {
        this.fileList = [file]
      }
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    async beforeUpload(file) {
      if (this.accept) {
        if (!_.some(this.accept.split(','), string => file.name.toLowerCase().includes(string.toLowerCase()))) {
          this.$message.error('文件格式错误，只允许' + this.accept)
          return Promise.reject()
        }
      }
    },
    handleError(error) {
      this.$message.error(error.status + '：' + error.message)
    },
    submit() {
      this.$refs.upload.submit()
    }
  }
}
</script>

<style scoped lang="less">
.accept {
  color: #999;
}
</style>
