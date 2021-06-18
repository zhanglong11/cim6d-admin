<template>
  <el-dialog
    width="600px"
    top="10vh"
    :title="form.id ? '修改' : '新建'"
    :visible="visible"
    @close="$emit('update:visible', false)"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="应用名称:" prop="name">
        <el-input v-model="form.name" placeholder="请输入应用名称" class="inputStyle" />
      </el-form-item>
      <el-form-item label="应用编码:" prop="appCode">
        <el-input v-model="form.appCode" placeholder="请输入应用编码" class="inputStyle" />
      </el-form-item>
      <el-form-item label="应用图标:" prop="icon">
        <UploadFile v-model="form.icon" listType="picture-card" class="inputStyle" isOnlyButton multiple>
          <div slot="btn">
            <el-button size="mini" type="primary">
              <i class="el-icon-upload2" style="font-size: 16px; margin-right: 5px; color: #fff"></i>上传</el-button
            >
          </div>
        </UploadFile>
      </el-form-item>
      <el-form-item label="应用简介" prop="description">
        <el-input v-model="form.description" type="textarea" placeholder="请输入应用简介" class="inputStyle" />
      </el-form-item>
      <el-divider>ios</el-divider>
      <el-form-item label="二维码:" prop="iosQrCode">
        <UploadFile v-model="form.iosQrCode" listType="picture-card" class="inputStyle" isOnlyButton multiple>
          <div slot="btn">
            <el-button size="mini" type="primary">
              <i class="el-icon-upload2" style="font-size: 16px; margin-right: 5px; color: #fff"></i>上传</el-button
            >
          </div>
        </UploadFile>
      </el-form-item>
      <el-form-item label="链接地址" prop="iosUrl">
        <el-input v-model="form.iosUrl" placeholder="请输入地址" class="inputStyle">
          <template slot="prepend">Http://</template>
        </el-input>
      </el-form-item>
      <el-divider>android</el-divider>
      <el-form-item label="二维码:" prop="androidQrCode">
        <UploadFile v-model="form.androidQrCode" listType="picture-card" class="inputStyle" isOnlyButton multiple>
          <div slot="btn">
            <el-button size="mini" type="primary">
              <i class="el-icon-upload2" style="font-size: 16px; margin-right: 5px; color: #fff"></i>上传</el-button
            >
          </div>
        </UploadFile>
      </el-form-item>
      <el-form-item label="链接地址" prop="androidUrl">
        <el-input v-model="form.androidUrl" placeholder="请输入地址" class="inputStyle">
          <template slot="prepend">Http://</template>
        </el-input>
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
  name: 'AddAppDialog',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: [Number, String],
      default: ''
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
        name: [{ required: true, message: '应用名称必填' }],
        appCode: [{ required: true, message: '应用编码必填' }],
        icon: [{ required: true, message: '图标必填' }],
        description: [{ required: true, message: '应用简介必填' }],
        iosQrCode: [{ required: true, message: 'ios二维码必填' }],
        iosUrl: [{ required: true, message: 'ios链接地址必填' }],
        androidQrCode: [{ required: true, message: 'android二维码必填' }],
        androidUrl: [{ required: true, message: 'android链接地址必填' }]
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
/deep/ .el-upload--picture-card {
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
}
</style>
