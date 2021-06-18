<template>
  <WorkFlow
    ref="workFlowRef"
    :urlSuffix="$urlSuffix"
    :token="token"
    :hasBasic="false"
    :hasProcess="false"
    :isFlagDelete="false"
    isAdminFlag
    isApprover
    :flag="config.flag"
    :styleId="id"
  >
    <div slot="header" class="work-header">
      <el-form ref="formRef" inline :model="formData" :rules="formDataRules">
        <el-form-item label="审批样式名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入审批样式名称" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="work-footer">
      <el-button size="medium" @click="cancelEvent()">取 消</el-button>
      <el-button size="medium" type="primary" :loading="btnLoading" @click="saveData()">提 交</el-button>
    </div>
  </WorkFlow>
</template>

<script>
import { OaApi } from '../api'
export default {
  name: 'AddFormStyle',
  data() {
    return {
      config: {
        flag: 2
      },
      id: this.$route.query.id || '',
      formData: {
        id: '',
        name: '',
        template: '',
        type: 1
      },
      formDataRules: {
        name: [
          {
            required: true,
            message: '请输入审批样式名称',
            trigger: 'blur'
          }
        ]
      },
      btnLoading: false
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token
    }
  },
  mounted() {
    this.getDetailsAuditStyle()
  },
  methods: {
    // 审批样式详情
    async getDetailsAuditStyle() {
      if (!this.id) {
        return
      }
      let result = await OaApi.getDetailsAuditStyle(this.id)
      let datas = result.data
      this.formData = datas
      console.log('审批样式详情', datas)
    },
    // 取消
    cancelEvent() {
      this.$router.go(-1)
    },
    // 保存
    saveData() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          this.$refs['workFlowRef'].getFormData((formData, subFormData) => {
            console.log('获取数据', formData, subFormData)
            this.formData.template = subFormData.template
            this.saveAuditStyle()
          })
        }
      })
    },
    // 保存审批样式
    async saveAuditStyle() {
      try {
        await OaApi.saveAuditStyle(this.formData)
        this.$message({
          type: 'success',
          message: `操作成功!`
        })
        this.btnLoading = false
        this.cancelEvent()
      } catch (e) {
        this.btnLoading = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
.work-header {
  padding: 20px 20px 0;
}
.work-footer {
  padding: 12px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
