<template>
  <el-dialog
    width="600px"
    top="10vh"
    :title="info && info.id ? '修改' : '新建'"
    :visible="visible"
    @close="$emit('update:visible', false)"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="更新日期:" prop="updateDate">
        <el-date-picker
          v-model="form.updateDate"
          type="datetime"
          placeholder="选择日期"
          class="inputStyle"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="版本:" prop="version">
        <el-input v-model="form.version" placeholder="请输入版本" class="inputStyle" />
      </el-form-item>
      <el-form-item label="是否强制更新" prop="forceUpdateFlag">
        <el-radio-group v-model="form.forceUpdateFlag">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="更新内容" prop="updateContent">
        <el-input
          v-model="form.updateContent"
          type="textarea"
          :rows="5"
          placeholder="请输入更新内容"
          class="inputStyle"
        />
      </el-form-item>
      <el-form-item label="更新文件:" prop="updateFileId">
        <UploadFile v-model="form.updateFileId" :fileUrl.sync="form.updateFileUrl" class="inputStyle" isOnlyButton>
          <div slot="btn">
            <el-button size="mini" type="primary">
              <i class="el-icon-upload2" style="font-size: 16px; margin-right: 5px; color: #fff"></i>上传</el-button
            >
          </div>
        </UploadFile>
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'AddFileDialog',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {},
      rules: {
        updateDate: [{ required: true, message: '更新日期不能为空' }],
        forceUpdateFlag: [{ required: true, message: '是否强制更新不能为空' }],
        version: [{ required: true, message: '版本号必填' }],
        updateContent: [{ required: true, message: '更新内容必填' }],
        updateFileId: [{ required: true, message: '更新文件不能为空' }]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.form = { ...this.info }
    },
    async submit() {
      await this.$refs.form.validate()
      this.$emit('submit', this.form)
    }
  }
}
</script>

<style scoped lang="less">
.inputStyle {
  width: 400px;
}
/*/deep/ .el-upload--picture-card {
    background-color: #fbfdff;
    border: none;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 50px;
    line-height: 50px;
    vertical-align: top;
    display: block;
  }*/
</style>
