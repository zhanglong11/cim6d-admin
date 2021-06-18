<template>
  <WorkFlow
    ref="workFlowRef"
    :urlSuffix="$urlSuffix"
    :token="token"
    isAdminFlag
    :flag="config.flag"
    :formId="id"
    :projectType="config.projectType"
    :projectTypeList="projectTypeList"
    @close="changeWorkFork"
    @change="changeWorkFork"
  />
</template>

<script>
import { OaApi } from '../api'
export default {
  name: 'AddFormStyle',
  data() {
    return {
      config: {
        flag: 2,
        projectType: 'construction3.0'
      },
      id: this.$route.query.id || '',
      projectTypeList: this.$getArgList('projectType'),
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
  methods: {
    // 取消
    cancelEvent() {
      this.$router.go(-1)
    },
    // 操作成功
    changeWorkFork() {
      this.cancelEvent()
    }
  }
}
</script>
